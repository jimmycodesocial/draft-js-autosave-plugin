export default ({
  debounceTime = 3000,
  saveFunction = null
} = {}) => {
  let clean = true;
  let oldState = null;
  let timeout = null;

  /**
   * Invoke save the changes.
   * @param {*} editorState Pending changes.
   */
  const save = (editorState) => {
    clean = true;
    oldState = editorState;

    if (saveFunction) {
      saveFunction(editorState);
    }
  };

  /**
   * Track editor changes.
   * @param {*} editorState Current state.
   */
  const onChange = (editorState) => {
    // Avoid errors.
    if (!editorState) {
      return editorState;
    }

    // Use the first state to look for changes.
    if (!oldState) {
      oldState = editorState;
    }

    // Changes in the editor.
    if (editorState.getCurrentContent() !== oldState.getCurrentContent()) {
      clean = false;

      if (timeout) {
        clearTimeout(timeout);
      }

      timeout = setTimeout(save, +debounceTime, editorState);
    }

    return editorState;
  };

  // Check if the eitor is clean of changes.
  const isClean = () => clean;

  return {
    onChange,
    isClean
  };
};
