import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './CodeGenerationModal.css';
import GraphSchematicsManager from '../GraphSchematics/GraphSchematicsManager';
import { FormattedMessage, injectIntl } from 'react-intl';

interface State {
  showModal: boolean;
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
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    Modal.setAppElement('#app');

    CodeGenerationModal.openSubject.subscribe(() => {
      this.setState({ showModal: true });
      GraphSchematicsManager.setPlayOrStop(false);
    });
  }

  handleCloseModal = () => {
    this.setState({ showModal: false });
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
              <FormattedMessage id="Geração de Código"/>
            </div>
            <div className="modal-close-icon" onClick={this.handleCloseModal}>
              X
            </div>
          </div>

          <div className='modal-content-extra'> 
            
            
         
          </div>
        </Modal>
      </div>
    );
  }
}

export default injectIntl(CodeGenerationModal) as unknown as typeof CodeGenerationModal;