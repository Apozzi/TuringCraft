import React from 'react';
import Draggable from 'react-draggable';
import { Subject } from 'rxjs';
import './ScreenDisplayModal.css';
import Tippy from '@tippyjs/react';
import TuringMachineTape from '../TuringMachineTape/TuringMachineTape';

export default class ScreenDisplayModal extends React.Component<any> {
  static openSubject = new Subject();

  state = {
    showModal: false,
    pixels: Array.from({ length: 340 })
  };

  static openModal(obj: any) {
    this.openSubject.next(obj); 
  }

  componentDidMount() {
    ScreenDisplayModal.openSubject.subscribe(() => {
      this.setState({ showModal: true });
    });
    TuringMachineTape.onTapeChange().subscribe((tape: any) => {
      let indexZero = tape.length/2 - 2
      this.setState({ pixels: tape.slice(indexZero, indexZero + 340)});
    });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  };

  private getColor = (value: any) => {
    if (value === 1) return 'white';
    if (value === 2) return 'red';
    if (value === 3) return 'green';
    if (value === 4) return 'blue';
    if (String(value).includes("#")) return value;
    return '#ffffff00';
  }

  renderPixels = () => {
    const pixels = this.state.pixels.map((v, index) => (
      <div key={index} className="pixel" style={{backgroundColor: this.getColor(v)}}></div>
    ));

    const rows = [];
    for (let i = 0; i < pixels.length; i += 20) {
      rows.push(
        <div key={`row-${i}`} className="pixel-row">
          {pixels.slice(i, i + 20)}
        </div>
      );
    }

    return rows;
  };
  render() {
    const { showModal } = this.state;

    return (
      <div>
        {showModal && (
          <>
            <Draggable>
              <div className="draggable-modal-container">
                <div className="draggable-modal-header">
                <div className='draggable-modal-header--title'>
                    <h2>Display Tela</h2> 
                    <Tippy content="O display tela utiliza o indices de 0-340 da fita a tela 20x17, cada linha de 20 em 20, caso o valor for 0 a cor é preta caso 1 branca, também (2 = vermelho, 3 = verde, 4 = azul ou hexadecimal que inicia com '#'), é possivel modificar em detalhes>configurações para utilizar um intervalo de indices diferente.">
                      <div className='draggable-modal-header--tooltip-icon'>?</div>
                    </Tippy>
                  </div>
                  <div className="modal-close-icon" onClick={this.closeModal}>
                    X
                  </div>
                </div>
                <div className="draggable-modal-body">
                  <div className="screen-background">
                    {this.renderPixels()}
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
