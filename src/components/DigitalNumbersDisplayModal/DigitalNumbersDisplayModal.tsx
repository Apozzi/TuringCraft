import React from 'react';
import Draggable from 'react-draggable';
import { Subject } from 'rxjs';
import './DigitalNumbersDisplayModal.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';


export default class DigitalNumbersDisplayModal extends React.Component<any> {
  static openSubject = new Subject();

  state = {
    showModal: false,
    data: null,
  };

  static openModal(obj: any) {
    this.openSubject.next(obj);
  }

  componentDidMount() {
    DigitalNumbersDisplayModal.openSubject.subscribe((data) => {
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
              <div className="draggable-modal-container" style={{minHeight: '363px', width: '338px'}}>
                <div className="draggable-modal-header">
                  <div className='draggable-modal-header--title'>
                    <h2>Display Numérico</h2> 
                    <Tippy content="O display númerico utiliza o indices de 0-6 da fita e converte a representação binária em decimal.">
                      <div className='draggable-modal-header--tooltip-icon'>?</div>
                    </Tippy>
                  </div>
                  <div className="modal-close-icon" onClick={this.closeModal}>
                    X
                  </div>
                </div>
                <div className="draggable-modal-body">
                  <div className='digital-numbers'>
                      88
                  </div>
                  <div className='digital-numbers'>
                    12
                 </div>
                </div>
              </div>
            </Draggable>
          </>
        )}
      </div>
    );
  }
}
