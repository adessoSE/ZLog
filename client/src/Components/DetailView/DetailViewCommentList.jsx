import React from 'react';
import DetailViewCommentListItem from './DetailViewCommentListItem';
import DetailViewButton from './DetailViewButton';
import DetailViewCommentAdder from './DetailViewCommentAdder';

/**
 * Renders a <DetailViewCommentList /> component.
 * @param {object} props - the components props
 * @param {object} props.selectedConditions - contains currently selected conditions
 * @param {function} props.setSelectedConditions - sets selectedConditions to a new object
 * @param {string} props.activeCommentId - id of the currently active comment
 * @param {function} props.setActiveCommentId - sets the id of the currently active comment
 * @param {boolean} props.isCommentBeingAdded - indicates if a comment is currently being added
 * @param {function} props.toggleIsCommentBeingAdded - toggles the state of isCommentBeingAdded
 * @param {boolean} props.isCommentBeingEdited - indicates if a comment is currently being edited
 * @param {function} props.toggleIsCommentBeingEdited - toggles the state of isCommentBeingEdited
 * @param {array} props.commentData - current commentData state
 * @param {function} props.updateCommentData - updates commentData state
 */
function DetailViewCommentList(props) {
  const {
    selectedConditions,
    setSelectedConditions,
    activeCommentId,
    setActiveCommentId,
    isCommentBeingAdded,
    toggleIsCommentBeingAdded,
    isCommentBeingEdited,
    toggleIsCommentBeingEdited,
    commentData,
    updateCommentData,
    addComment,
    deleteComment,
    editComment,
  } = props;

  return (
    <div className="container">
      {commentData &&
        commentData.map((comment) => {
          return (
            <DetailViewCommentListItem
              selectedConditions={selectedConditions}
              key={comment.id}
              activeCommentId={activeCommentId}
              setActiveCommentId={setActiveCommentId}
              isCommentBeingAdded={isCommentBeingAdded}
              isCommentBeingEdited={isCommentBeingEdited}
              toggleIsCommentBeingEdited={toggleIsCommentBeingEdited}
              commentId={comment.id}
              text={comment.comment}
              author={comment.author}
              conditions={comment.conditions}
              updateCommentData={updateCommentData}
              disabled={true}
              deleteComment={deleteComment}
              editComment={editComment}
            />
          );
        })}

      {isCommentBeingAdded ? (
        <DetailViewCommentAdder
          setActiveCommentId={setActiveCommentId}
          selectedConditions={selectedConditions}
          setSelectedConditions={setSelectedConditions}
          isCommentBeingAdded={isCommentBeingAdded}
          toggleIsCommentBeingAdded={toggleIsCommentBeingAdded}
          updateCommentData={updateCommentData}
          addComment={addComment}
        />
      ) : (
        <div className="d-flex flex-column align-items-end ml-1">
          <DetailViewButton
            type="add"
            handleOnClick={toggleIsCommentBeingAdded}
            isDisabled={isCommentBeingEdited}
            title="Kommentar hinzufügen"
          />
        </div>
      )}
    </div>
  );
}

export default DetailViewCommentList;
