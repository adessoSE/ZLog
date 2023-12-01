import React, { useState, useEffect } from 'react';
import DetailViewHeader from './DetailViewHeader';
import DetailViewDetails from './DetailViewDetails';
import DetailViewCommentList from './DetailViewCommentList';
import DetailViewError from './DetailViewError';
import * as Selectors from '../../Redux/selectors';
import * as Actions from '../../Redux/actions';
//careful when importing * from something. methods from exports at the bottom are undefined

import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import '../../SCSS/DetailView.scss';

import DefaultLoadingOverlay from '../../utils/DefaultLoadingOverlay';
import { connect } from 'react-redux';
import { REQ_SPECIFIC_DOCUMENT } from '../../utils/requestTypes';

function DetailView(props) {
  const {
    isDetailViewOpen,
    toggleDetailView,
    isFetching,
    commentData,
    document,
    documentID,
    extractCommentsForDocument,
    addCommentAction,
    deleteCommentAction,
    editCommentAction,
  } = props;

  const [isCommentBeingAdded, setIsCommentBeingAdded] = useState(false);
  const [isCommentBeingEdited, setIsCommentBeingEdited] = useState(false);
  const [activeCommentId, setActiveCommentId] = useState('');
  const [selectedConditions, setSelectedConditions] = useState({});

  useEffect(() => {
    if (activeCommentId === '') {
      return;
    }
    const activeComment = commentData.find((comment) => {
      return comment.id === activeCommentId;
    });
    activeComment && setSelectedConditions(JSON.parse(activeComment.conditions));
  }, [activeCommentId, commentData]);

  /**
   * Toggles the state of isCommentBeingAdded.
   */
  const toggleIsCommentBeingAdded = () => {
    setIsCommentBeingAdded(!isCommentBeingAdded);
  };

  /**
   * Toggles the state of isCommentBeingEdited.
   */
  const toggleIsCommentBeingEdited = () => {
    setIsCommentBeingEdited(!isCommentBeingEdited);
  };

  /**
   * Adds a condition to selectedConditions.
   * @param {string} conditionKey - the key of the condition
   * @param {string} conditionValue - the value of the condition
   */
  const addSelectedCondition = (conditionKey, conditionValue) => {
    let updatedSelectedConditions = {
      ...selectedConditions,
    };

    updatedSelectedConditions[conditionKey] = conditionValue.toString();

    setSelectedConditions(updatedSelectedConditions);
  };

  /**
   * Removes a condition from selectedConditions.
   * @param {string} conditionKey - the key of the condition
   */
  const removeSelectedCondition = (conditionKey) => {
    let updatedSelectedConditions = {
      ...selectedConditions,
    };

    delete updatedSelectedConditions[conditionKey];

    setSelectedConditions(updatedSelectedConditions);
  };

  /**
   * Checks if a conditionis contained in the active comment's conditions.
   * @param {string} conditionKey - the key of the condition
   * @param {string} conditionValue - the value of the condition
   */
  const checkIfConditionIsInActiveCommentConditions = (conditionKey, conditionValue) => {
    const activeComment = commentData.find((comment) => {
      return comment.id === activeCommentId;
    });

    const conditionEntries = Object.entries(JSON.parse(activeComment.conditions));

    let conditionsIsInActiveCommentConditions = false;

    conditionEntries.some((conditionEntry) => {
      if (
        conditionEntry[0].toString() === conditionKey.toString() &&
        conditionEntry[1].toString() === conditionValue.toString()
      ) {
        conditionsIsInActiveCommentConditions = true;
      }
      return conditionsIsInActiveCommentConditions;
    });
    return conditionsIsInActiveCommentConditions;
  };

  return (
    <Modal
      className="modal-content-details"
      isOpen={isDetailViewOpen}
      centered={true}
      id="detailmodal"
      toggle={toggleDetailView}
    >
      <DefaultLoadingOverlay active={false && isFetching} spinner>
        <ModalHeader toggle={toggleDetailView}>
          <DetailViewHeader isValidDocument={document != null} document={document} isFetching={isFetching} />
        </ModalHeader>
        <ModalBody>
          {!isFetching && document == null ? (
            <DetailViewError documentID={documentID} />
          ) : !isFetching && document != null ? (
            <DetailViewDetails
              document={document}
              isCommentBeingAdded={isCommentBeingAdded}
              isCommentBeingEdited={isCommentBeingEdited}
              checkIfConditionIsInActiveCommentConditions={checkIfConditionIsInActiveCommentConditions}
              addSelectedCondition={addSelectedCondition}
              removeSelectedCondition={removeSelectedCondition}
            />
          ) : null}

          {commentData != null && (
            <DetailViewCommentList
              selectedConditions={selectedConditions}
              setSelectedConditions={setSelectedConditions}
              activeCommentId={activeCommentId}
              setActiveCommentId={setActiveCommentId}
              isCommentBeingAdded={isCommentBeingAdded}
              toggleIsCommentBeingAdded={toggleIsCommentBeingAdded}
              isCommentBeingEdited={isCommentBeingEdited}
              toggleIsCommentBeingEdited={toggleIsCommentBeingEdited}
              commentData={commentData}
              updateCommentData={() => extractCommentsForDocument(document)}
              addComment={addCommentAction}
              deleteComment={deleteCommentAction}
              editComment={editCommentAction}
            />
          )}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary ml-auto" onClick={toggleDetailView}>
            Schließen
          </button>
        </ModalFooter>
      </DefaultLoadingOverlay>
    </Modal>
  );
}

const mapStateToProps = (state) => {
  return {
    isDetailViewOpen: Selectors.selectIsDetailViewOpen(state),
    isFetching: Selectors.selectIsRequestTypeActive(state, REQ_SPECIFIC_DOCUMENT),
    document: Selectors.selectDetailViewDocument(state),
    documentID: Selectors.selectDetailViewDocumentID(state),
    commentData: Selectors.selectCommentData(state),
  };
};
const mapDispatchToProps = {
  toggleDetailView: Actions.toggleDetailViewOpenAction,
  extractCommentsForDocument: Actions.extractCommentsForDocument,
  addCommentAction: Actions.addCommentAction,
  deleteCommentAction: Actions.deleteCommentAction,
  editCommentAction: Actions.editCommentAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DetailView);
