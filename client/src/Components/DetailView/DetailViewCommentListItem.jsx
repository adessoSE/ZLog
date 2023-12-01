import React, { useState, useEffect, useRef } from 'react';
import DetailViewButton from './DetailViewButton';
import DetailViewCommentField from './DetailViewCommentField';
import DetailViewConditions from './DetailViewConditions';

/**
 * Renders a <DetailViewCommentListItem /> component.
 * @param {object} props - the components props
 * @param {object} props.selectedConditions - contains currently selected conditions
 * @param {string} props.activeCommentId - id of the currently active comment
 * @param {function} props.setActiveCommentId - sets the id of the currently active comment
 * @param {string} props.commentId - id of the comment related to the list item
 * @param {string} props.text - the text that gets passed to the comment field
 * @param {string} props.author - the author that gets passed to the author field
 * @param {object} props.conditions - the conditions related to the list item
 * @param {boolean} props.isCommentBeingAdded - indicates if a comment is currently being added
 * @param {boolean} props.isCommentBeingEdited - indicates if a comment is currently being edited
 * @param {function} props.toggleIsCommentBeingEdited - toggles the state of isCommentBeingEdited
 * @param {boolean} props.disabled - the list item's disabled state (true => list item is disabled)
 * @param {function} props.updateCommentData - updates commentData state
 */
function DetailViewCommentListItem(props) {
  const {
    selectedConditions,
    activeCommentId,
    setActiveCommentId,
    commentId,
    text,
    author,
    conditions,
    isCommentBeingAdded,
    isCommentBeingEdited,
    toggleIsCommentBeingEdited,
    disabled,
    updateCommentData,
    deleteComment,
    editComment,
  } = props;

  const [isDisabled, setIsDisabled] = useState(disabled);

  const commentFieldRef = useRef();

  /**
   * Handles edit button's onClick.
   */
  const handleEdit = () => {
    if (isCommentBeingEdited || isCommentBeingAdded) {
      return;
    }
    setActiveCommentId(commentId);
    toggleEditingMode();
  };

  /**
   * Toggles editing mode.
   */
  const toggleEditingMode = () => {
    toggleIsCommentBeingEdited();
    setIsDisabled(!isDisabled);
  };

  /**
   * Saves edited comment.
   */
  const saveChangedComment = () => {
    toggleEditingMode();
    const comment = commentFieldRef.current.value;
    editComment(commentId, comment, selectedConditions, updateCommentData);
  };

  useEffect(() => {
    !isDisabled && commentFieldRef.current.focus();
    commentFieldRef.current.selectionStart = commentFieldRef.current.value.length;
    commentFieldRef.current.selectionEnd = commentFieldRef.current.value.length;
  });

  return (
    <>
      <div className="d-flex flex-row mb-1 ml-1" style={{ height: 100 }}>
        <DetailViewCommentField ref={commentFieldRef} text={text} isDisabled={isDisabled} />
      </div>

      <div className="d-flex flex-row mb-1 ml-1" style={{ height: 40 }}>
        <DetailViewCommentField text={author} isDisabled={true} />

        {isCommentBeingEdited && commentId === activeCommentId ? (
          <>
            <DetailViewButton type="cancel" handleOnClick={toggleEditingMode} title="abbrechen" />
            <DetailViewButton type="save" handleOnClick={saveChangedComment} title="speichern" />
          </>
        ) : (
          <>
            <DetailViewButton
              type="delete"
              handleOnClick={() => deleteComment(commentId, updateCommentData)}
              title="löschen"
              isDisabled={(isCommentBeingEdited && activeCommentId !== commentId) || isCommentBeingAdded}
            />
            <DetailViewButton
              type="edit"
              handleOnClick={handleEdit}
              title="editieren"
              isDisabled={(isCommentBeingEdited && activeCommentId !== commentId) || isCommentBeingAdded}
            />
          </>
        )}
      </div>
      <div className="d-flex flex-row mb-3 ml-1">
        <DetailViewConditions conditions={conditions} />
      </div>
    </>
  );
}

export default DetailViewCommentListItem;
