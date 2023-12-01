// import React, { useState } from 'react';
// import ReactBlockly from 'react-blockly';
// import Octicon, { ArrowLeft, Clock, History } from '@primer/octicons-react';
// import moment from 'moment';
// import Blockly from 'blockly';
// import { toast } from 'react-toastify';
//
// import { useHistory } from 'react-router-dom';
// import { LoggingRoute } from './LoggingRouter';
// import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from 'reactstrap';
// import { v1 as uuidv1 } from 'uuid';
// import { connect, useDispatch, useSelector } from 'react-redux';
// import { selectIsRequestTypeActive } from '../Redux/activeRequests/activeRequests.selectors';
// import { REQ_TRIGGER_SAVE } from '../utils/requestTypes';
// import { saveTrigger as saveTriggerAction } from '../Redux/actions';
// import { selectAllFields } from '../Redux/selectors';
//
// function TriggerEditorScreen(props) {
//   const { currentTrigger } = props;
//   const dispatch = useDispatch();
//   const isSaving = useSelector((state) => {
//     selectIsRequestTypeActive(state, REQ_TRIGGER_SAVE);
//   });
//
//   const newTrigger = () => {
//     return {
//       id: uuidv1(),
//       title: '',
//       description: '',
//       //xml: Blockly.Xml.domToText(Blockly.Xml.blockToDom(Blockly.Blocks['Trigger'])),
//     };
//   };
//
//   const isNewTrigger = () => {
//     return !currentTrigger || currentTrigger.id !== trigger.id;
//   };
//
//   const toggleWarningOpen = () => {
//     setWarningOpen(!warningOpen);
//   };
//
//   const generateJson = () => {
//     return Blockly.Json.workspaceToCode(Blockly.mainWorkspace);
//   };
//
//   const saveTrigger = (closeAfter) => {
//     if (!isNewTrigger()) {
//       return updateTrigger(closeAfter);
//     }
//
//     if (!trigger.title) {
//       toast.error('You need to specify a title!');
//       return;
//     }
//
//     const now = moment();
//
//     let doc = Object.assign({}, trigger);
//     doc.author = 'Test Author';
//     doc.creationTime = now;
//     doc.lastModified = now;
//     doc.title = trigger.title;
//     doc.execCount = 0;
//     doc.xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
//     doc.json = JSON.stringify(generateJson());
//     doc.active = true;
//
//     dispatch(
//       saveTriggerAction(doc, () => {
//         toast.success('Trigger "' + trigger.title + '" successfully saved');
//         setTriggerLastSave(Object.assign({}, trigger));
//
//       })
//     );
//   };
//
//   const updateTrigger = (closeAfter) => {
//     const now = moment();
//
//     let doc = Object.assign({}, trigger);
//     doc.lastModified = now;
//     doc.xml = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
//     doc.json = JSON.stringify(generateJson());
//     doc.title = trigger.title;
//     doc.description = trigger.description;
//     doc._version_ = undefined;
//
//     //console.log(JSON.stringify(generateJson()));
//
//     dispatch(
//       saveTriggerAction(doc, () => {
//         toast.success('Trigger "' + trigger.title + '" successfully updated');
//         setTriggerLastSave(Object.assign({}, trigger));
//         setTrigger({
//           ...trigger,
//           lastModified: now,
//         });
//
//       })
//     );
//   };
//
//   /**
//    * Exits editing the editor and navigates back to admin page
//    * Executed when clicked the back button top right
//    * @param {Boolean} force Set to true if you want to skip the confirmation window and exit in every case
//    */
//   const cancelTrigger = (force = false) => {
//     if (hasUnsavedChanges() && !force) {
//       setWarningOpen(true);
//     }
//   };
//
//   const onWorkspaceChanged = () => {
//     //setHasUnsavedChanges(true);
//   };
//
//   const formatTime = (time) => {
//     let m = moment(time);
//     return m.format('DD.MM.YYYY HH:mm:ss');
//   };
//
//   const hasUnsavedChanges = () => {
//     //deep compare last saved with current trigger
//     const cKeys = Object.keys(trigger);
//     const lKeys = Object.keys(triggerLastSave);
//
//     return (
//       cKeys.length !== lKeys.length ||
//       cKeys.filter((key) => {
//         return key !== 'lastModified' && trigger[key] !== triggerLastSave[key];
//       }).length > 0
//     );
//   };
//
//   const history = useHistory();
//
//   const [trigger, setTrigger] = useState(currentTrigger ? Object.assign({}, currentTrigger) : newTrigger());
//   const [triggerLastSave, setTriggerLastSave] = useState(Object.assign({}, trigger));
//   const [warningOpen, setWarningOpen] = useState();
//
//   return (
//     <div className="trigger-editor">
//       <div className="blockly-editor">
//         <div className="header">
//           <span className="mr-2">
//             <Button onClick={() => cancelTrigger(false)} className="btn btn-secondary">
//               <Octicon icon={ArrowLeft} />
//             </Button>
//           </span>
//           <span className="mr-2">
//             <Button onClick={() => saveTrigger()} className="btn btn-secondary">
//               {isSaving ? (
//                 <Spinner animation="border" size="sm" role="status" />
//               ) : (
//                 <span>{hasUnsavedChanges() ? 'Save*' : 'Save'}</span>
//               )}
//             </Button>
//           </span>
//           <span className="title w-25 mr-3">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Trigger Name"
//               onChange={(e) =>
//                 setTrigger({
//                   ...trigger,
//                   title: e.target.value,
//                 })
//               }
//               value={trigger.title}
//             />
//           </span>
//           <span className="description w-25 mr-3">
//             <input
//               type="text"
//               className="form-control"
//               placeholder="Description"
//               onChange={(e) =>
//                 setTrigger({
//                   ...trigger,
//                   description: e.target.value,
//                 })
//               }
//               value={trigger.description}
//             />
//           </span>
//           <span className="d-flex flex-column align-content-center text-muted">
//             {trigger.creationTime && (
//               <div title="Created at">
//                 <span className="mr-1">
//                   <Octicon icon={Clock} />
//                 </span>
//                 <small>{formatTime(trigger.creationTime)}</small>
//               </div>
//             )}
//             {trigger.lastModified && (
//               <div title="Last modified at">
//                 <span className="mr-1">
//                   <Octicon icon={History} />
//                 </span>
//                 <small>{formatTime(trigger.lastModified)}</small>
//               </div>
//             )}
//           </span>
//           <span className="grow" />
//           <span>{trigger.id}</span>
//         </div>
//         <Modal isOpen={warningOpen} toggle={toggleWarningOpen} className="warning">
//           <ModalHeader toggle={toggleWarningOpen}>Warning</ModalHeader>
//           <ModalBody>There are unsafed changes. If you now continue, all changes will be lost.</ModalBody>
//           <ModalFooter>
//             <Button className="btn btn-secondary" onClick={() => setWarningOpen(false)}>
//               Keep Editing
//             </Button>
//             <Button className="btn btn-secondary" onClick={() => cancelTrigger(true)}>
//               Close without saving
//             </Button>
//             <Button className="btn btn-secondary" onClick={() => saveTrigger(true)}>
//               Close and save
//             </Button>
//           </ModalFooter>
//         </Modal>
//       </div>
//     </div>
//   );
// }
//
// const mapStateToProps = (state) => {
//   return {
//     fields: selectAllFields(state),
//   };
// };
//
// export default connect(mapStateToProps)(TriggerEditorScreen);
