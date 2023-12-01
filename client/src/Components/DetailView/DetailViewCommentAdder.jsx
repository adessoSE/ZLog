import React, { useEffect, useCallback } from 'react';
import DetailViewCommentField from './DetailViewCommentField';
import DetailViewButton from './DetailViewButton';
import { selectUserName, /*selectIsSessionExpired*/ } from '../../Redux/auth/auth.selectors'
import { connect } from 'react-redux';

/**
 * Renders a <DetailViewCommentAdder /> component.
 * @param {object} props - the components props
 * @param {function} props.setActiveCommentId - sets the state of activeCommentId
 * @param {object} props.selectedConditions - the currently selected conditions
 * @param {function} props.setSelectedConditions - sets the state of selectedConditions
 * @param {function} props.toggleIsCommentBeingAdded - toggles isCommentBeingAdded boolean value
 * @param {function} props.updateCommentData - updates commentData state
 */
function DetailViewCommentAdder(props) {
  const {
    setActiveCommentId,
    selectedConditions,
    setSelectedConditions,
    toggleIsCommentBeingAdded,
    updateCommentData,
    addComment,
    //isExpired,
    username
  } = props;

  const commentFieldFref = useCallback((node) => {
    if (node !== null) {
      node.focus();
      node.selectionStart = node.value.length;
      node.selectionEnd = node.value.length;
    }
  }, []);

  useEffect(() => {
    setActiveCommentId('');
    setSelectedConditions({});
  }, [setActiveCommentId, setSelectedConditions]);

  /**
   * Handles the save button's onClick.
   */
  const handleSave = () => {
    const author = document.getElementById('new-comment-field-author').value;
    const comment = document.getElementById('new-comment-field-text').value;

    //console.log(`author: ${author}, comment: ${comment}, selectedConditions: `, selectedConditions)
    addComment(author, comment, selectedConditions, updateCommentData).then(toggleIsCommentBeingAdded);
  };

  return (
    <>
      <div className="d-flex flex-row mb-1 ml-1" style={{ height: 100 }}>
        <DetailViewCommentField ref={commentFieldFref} id={'new-comment-field-text'} placeholder="Kommentar..." />
      </div>
      <div className="d-flex flex-row mb-2 ml-1" style={{ height: 40 }}>
        <DetailViewCommentField id={'new-comment-field-author'} text={username} isDisabled={true} />

        <DetailViewButton type="cancel" handleOnClick={toggleIsCommentBeingAdded} title="abbrechen" />
        <DetailViewButton type="save" handleOnClick={handleSave} title="speichern" />
      </div>
    </>
  );
}
const mapStateToProps = (state) => {
  return {
    //isExpired: selectIsSessionExpired(state),
    username: selectUserName(state),
  };
};

export default connect(mapStateToProps)(DetailViewCommentAdder);
