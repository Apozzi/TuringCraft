import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './CodeGenerationModal.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';
import { FormattedMessage, injectIntl } from 'react-intl';
import generateTuringMachineCode from '../../utils/turingCodeGenerator';


interface State {
  showModal: boolean;
  generatedCode: string;
}

class CodeGenerationModal extends React.Component<any, State> {
  static openSubject = new Subject();

  customStyles = {
    content: {
      height: '80%',
      background: 'rgb(42 42 49)',
      border: 'none',
      padding: "0px"
    }
  };

  state: State = {
    showModal: false,
    generatedCode: ''
  };

  private textareaRef = React.createRef<HTMLTextAreaElement>();

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    Modal.setAppElement('#app');

    CodeGenerationModal.openSubject.subscribe((obj) => {
      this.setState({ 
        showModal: true,
        generatedCode: generateTuringMachineCode(GraphSchematicsManager.getGraphState())
      });
      GraphSchematicsManager.setPlayOrStop(false);
    });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
  }

  handleCopyCode = () => {
    if (this.textareaRef.current) {
      this.textareaRef.current.select();
      document.execCommand('copy');
    }
  }

  render() {
    return (
      <div>
        <Modal
          isOpen={this.state.showModal}
          contentLabel="Project"
          style={this.customStyles}
          onRequestClose={this.handleCloseModal}
          overlayClassName="overlay"
        >
          <div className="modal-header">
            <div className="modal-title">
              <FormattedMessage id="code_generation"/>
            </div>
            <div className="modal-close-icon" onClick={this.handleCloseModal}>
              X
            </div>
          </div>

          <div className='terminal-modal-content'> 
            <div className="terminal-container">
              <div className="terminal-header">
                <button onClick={this.handleCopyCode}>Copy</button>
              </div>
              <textarea 
                ref={this.textareaRef}
                readOnly 
                className="terminal-textarea" 
                value={this.state.generatedCode}
              />
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default injectIntl(CodeGenerationModal) as unknown as typeof CodeGenerationModal;