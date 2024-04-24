<script>
	// @ts-nocheck

	import { browser } from '$app/environment';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let placeholder;
	export let maxLength = 20;
	export let value = '';
	export let regex = /^[a-zA-Z0-9_\- ]+$/;
	export let extraClasses = '';

	let backupText = null;

	function handleInputCommit() {
		backupText = null;
		window.getSelection().removeAllRanges();
		document.activeElement.blur();
		dispatch('onsave', { value });
	}

	function handleInputDiscard(input) {
		if (backupText != null) {
			value = backupText;
			backupText = null;
		}
		window.getSelection().removeAllRanges();
		document.activeElement.blur();
	}

	function onKeyDown(e) {
		if (
			value.length + 1 > maxLength &&
			regex.test(e.key) &&
			!e.ctrlKey &&
			!e.metaKey &&
			e.key.length == 1 && // only stop characters from being typed
			window.getSelection().toString().length === 0
		) {
			e.preventDefault();
			e.stopPropagation();
			return;
		}
		// deselect and save on enter
		if (e.key === 'Enter') {
			handleInputCommit();
		}
		// deselect and restore original text on esc
		if (e.key === 'Escape') {
			handleInputDiscard(e.target);
		}
		// don't allow meta keys like arrow keys, enter, or any other modifiers
		if (!regex.test(e.key) && e.key.length !== 1) {
			// @* TODO: display alert informing the user that they can only type alphanumeric characters? *@
			e.preventDefault();
			e.stopPropagation();
		}
	}

	function handleInputPaste(e) {
		e.preventDefault();
		e.stopPropagation();

		let clipboardText = e.clipboardData.getData('text/plain');
		if (!clipboardText) return;

		let strippedText = '';
		// I would use string.replace here but the regex is passed in as a check
		// for which characters are valid, so the replace function would replace all
		// valid characters and leave the invalid ones.
		for (let i = 0; i < clipboardText.length; i++) {
			if (regex.test(clipboardText[i])) {
				strippedText += clipboardText[i];
			}
		}
		if (strippedText.length === 0) return;

		clipboardText = strippedText;
		let selection = window.getSelection();

		let start = Math.min(selection.anchorOffset, selection.focusOffset);
		let end = Math.max(selection.anchorOffset, selection.focusOffset);

		// if we paste then any selection should be replaced
		let sliced = value.splice(start, end - start);

		// if we paste text that is too long, insert as much as we can
		let remainingCharacters = maxLength - sliced.length;
		// if we are already at the character limit then there is nothing to do
		if (remainingCharacters < 0) return;

		let pastedText = clipboardText.substring(0, remainingCharacters);

		// update input field
		value = sliced.splice(start, 0, pastedText);

		// this is an anti pattern but since Svelte batches DOM updates we
		// are unable to set the selection below so we must manually update the dom
		e.target.textContent = value;

		let range = document.createRange();
		range.setStart(e.target.childNodes[0], start + pastedText.length);
		range.collapse(true);
		selection.removeAllRanges();
		selection.addRange(range);
		e.target.focus();
	}

	if (browser) {
		// @* https://stackoverflow.com/a/53239625 *@
		String.prototype.splice = function (index, count, add) {
			if (index < 0) {
				index += this.length;
				if (index < 0) index = 0;
			}
			return this.slice(0, index) + (add || '') + this.slice(index + count);
		};
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<span
	id="schedule-title"
	class="schedule-title p-1 px-2 d-flex text-center mx-auto {extraClasses}"
	contenteditable="true"
	{placeholder}
	data-gramm="false"
	bind:textContent={value}
	on:keydown={(e) => onKeyDown(e)}
	on:focusin={(e) => {
		backupText = value;
	}}
	on:focusout={() => {
		if (backupText == null || value.length == 0) return;

		handleInputCommit();
	}}
	on:paste={(e) => handleInputPaste(e)}
>
</span>
