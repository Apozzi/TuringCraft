import React from 'react';
import './TuringMachineTape.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

interface TuringMachineTapeState {
  isPlaying: boolean;
  tape: number[];
  xTranslation: 0
}

export default class TuringMachineTape extends React.Component<any> {
  state : TuringMachineTapeState  = {
    isPlaying: false,
    tape: Array(100).fill(0), // Inicializa um array de 100 zeros
    xTranslation: 0
  };

  componentDidMount() {
    // Qualquer lógica de inicialização adicional, se necessário
  }

  clickLeft() {
    this.setState({xTranslation: this.state.xTranslation-1});
  }

  clickRight() {
    this.setState({xTranslation: this.state.xTranslation+1});
  }

  handleChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    this.setState((prevState: TuringMachineTapeState) => {
      const newTape = [...prevState.tape];
      newTape[index] = newValue;
      return { tape: newTape };
    });
  };

  render() {
    const {tape, xTranslation} = this.state;
    return (
      <div className="turing-machine-tape">
        <div className="turing-machine-tape--header">
          {/* Header content if needed */}
          <div className='turing-machine-tape--button-left' onClick={() => this.clickLeft()}>
            <FontAwesomeIcon 
              icon={faChevronLeft} 
              size="lg" 
              className='databar-topbar--icon' />
          </div>
          <div className='turing-machine-tape--button-right' onClick={() => this.clickRight()}>
            <FontAwesomeIcon 
              icon={faChevronRight} 
              size="lg" 
              className='databar-topbar--icon' />
          </div>

          <div className='turing-machine-tape--display'>
            <FontAwesomeIcon 
              icon={faCalculator} 
              style={{marginLeft: '21px'}}
              size="lg" 
              className='databar-topbar--icon' />
          </div>
        </div>
        <div className="turing-machine-tape--tape" style={{
          transform: "translateX("+ xTranslation*400 + "px)"
        }}>
          {tape.map((value, index) => (
            <div key={index} className="turing-machine-tape--tape-item">
              <div className="turing-machine-tape--index">{index + 2 -tape.length/2}</div>
              <input
                type="number"
                className="turing-machine-tape--tape-item-content"
                value={value}
                onChange={(event) => this.handleChange(index, event)}
              />
          </div>
          ))}
        </div>
      </div>
    );
  }
}