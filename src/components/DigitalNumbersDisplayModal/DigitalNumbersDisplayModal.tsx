import React from 'react';
import Modal from 'react-modal';
import { Subject } from 'rxjs';
import './DigitalNumbersDisplayModal.css';
import { FormattedMessage } from 'react-intl';

export default class DigitalNumbersDisplayModal extends React.Component<any> {
  static openSubject = new Subject();

  customStyles = {
    content : {
      height: '80%',
      background: 'rgb(42 42 49)',
      border: 'none',
      padding: "0px"
    }
  };

  state = {
    showModal: false,
    label: '',
    value: 0,
    index: 0
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }


  componentDidMount() {
    Modal.setAppElement('#app');
    DigitalNumbersDisplayModal.openSubject.subscribe(() => {
      this.setState({ showModal: true });
    });
  }

  handleCloseModal () {
    this.setState({ showModal: false });
  }


  render() {
    return (
      <div>
        <Modal
           isOpen={this.state.showModal}
           contentLabel="Project"
           style={this.customStyles}
           onRequestClose={() => this.handleCloseModal()}
           overlayClassName="overlay"
           className='content-about'
        >
          <div className="modal-header">
            <div className="modal-title">
              <FormattedMessage id={"about"}/>
            </div>
            <div className="modal-close-icon" onClick={() => this.handleCloseModal()}>
              X
            </div>
          </div>
          


        </Modal>
      </div>
    )
  }
}