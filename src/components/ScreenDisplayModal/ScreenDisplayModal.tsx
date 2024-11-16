import React from 'react';
import Draggable from 'react-draggable';
import { Subject } from 'rxjs';
import './ScreenDisplayModal.css';

export default class ScreenDisplayModal extends React.Component<any> {
  static openSubject = new Subject();

  state = {
    showModal: false,
    data: null,
  };

  static openModal(obj: any) {
    this.openSubject.next(obj); 
  }

  componentDidMount() {
    ScreenDisplayModal.openSubject.subscribe((data) => {
      this.setState({ showModal: true, data });
    });
  }

  closeModal = () => {
    this.setState({ showModal: false, data: null });
  };

  render() {
    const { showModal, data } = this.state;

    return (
      <div>
        {/* Modal visível apenas quando showModal for true */}
        {showModal && (
          <>
            <Draggable>
              <div className="draggable-modal-container">
                <div className="draggable-modal-header">
                  <h2>Display Tela</h2>
                  <div className="modal-close-icon" onClick={this.closeModal}>
                    X
                  </div>
                </div>
                <div className="draggable-modal-body">
                  <p>Este é o conteúdo da modal!</p>
                 
                </div>
              </div>
            </Draggable>
          </>
        )}
      </div>
    );
  }
}
