import React from 'react';
import './GraphSchematics.css';
import GraphSchematicsManager from './GraphSchematicsManager';
import AlphabetIterator from '../../utils/AlphabetIterator';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import SimulatorUtils from '../../utils/SimulatorUtils';
import { NotaMusical, NOTE_FREQUENCIES } from '../../enums/NotasMusicaisEnum';
import { AudioManager } from '../../utils/AudioManager';
import { Vertex } from '../../interfaces/Vertex';
import { Edge } from '../../interfaces/Edge';
import { FruchtermanReingold } from '../../utils/FruchtermanReingoldAlgorithm';
import { CircularLayout } from '../../utils/layouts/CircularLayout';
import { GridLayout } from '../../utils/layouts/GridLayout';
import { TreeLayout } from '../../utils/layouts/TreeLayout';
import { RadialLayout } from '../../utils/layouts/RadialLayout';
import { SpectralLayout } from '../../utils/layouts/SpectralLayout';
import { KamadaKawai } from '../../utils/KamadaKawaiAlgorithm';
import AddEdgeModal from '../AddEdgeModal/AddEdgeModal';
import TuringMachineTape from '../TuringMachineTape/TuringMachineTape';

const debugMode = false;

const offsetWidth = 180;
const minZoom = 0.5;
const maxZoom = 2.5;
const vertexRadius = 40;
const selectionBorderSize = 20
const minDistance = vertexRadius * 2 + selectionBorderSize;
const initState = {
  offsetX: 0,
  offsetY: 0,
  width: window.innerWidth - offsetWidth,
  height: window.innerHeight,
  scale: 1,
  vertices: [],
  edges: [],
  selectedVertex: null,
  draggingVertex: false,
  edgeCreationMode: false,
  edgeStartVertex: null,
  edgeWeights: {},
  actualVertex: null,
  audioContext: null,
  vertexHistory: [],
};

interface TuringTransition {
  read: string;
  write: string;
  move: 'L' | 'R';
}

interface EdgeWeights {
  [sourceId: number]: {
    [targetId: number]: TuringTransition[];
  };
}

let nextVertexId = 0;

let mounted = false;
export default class GraphSchematics extends React.Component<{}, { 
  offsetX: number; 
  offsetY: number, 
  width: number, 
  height: number, 
  scale: number, 
  vertices: Vertex[], 
  edges: Edge[],
  selectedVertex: number | null, 
  draggingVertex: boolean,
  edgeCreationMode: boolean,
  edgeStartVertex: number | null,
  actualVertex: number | null,
  audioContext: AudioContext | null;
  vertexHistory: number[];
  centroid: Vertex | null;
  centroidUpdateCounter: number;
  config: any;
  edgeWeights: EdgeWeights;
  tape: string[];
  headPosition: number;
  currentState: number | null;
  isRunning: boolean;
}> {
  audioManager: AudioManager;
  private centroidUpdateTimer: any = null;

  constructor(props: any) {
    super(props);
    this.isDragging = false;
    this.startX = 0;
    this.startY = 0;
    this.state = {
      ...initState,
      centroid: null,
      centroidUpdateCounter: 0,
      audioContext: new AudioContext(),
      edgeWeights: {},
      tape: ['B'],
      headPosition: 500, //Default do tape é 1000 e deve iniciar no meio.
      currentState: null,
      isRunning: false,
      config: {
        speed: 1
      }
    };
    this.audioManager = new AudioManager(this.state.audioContext as AudioContext);
  }

  componentDidMount() {

    window.addEventListener('resize', this.handleResize);
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.setState({ audioContext });
    if (!mounted) {
      this.updateCentroid();
      GraphSchematicsManager.onAddVertex().subscribe((data:any) => this.addVertex(data.x, data.y, data.label));
      GraphSchematicsManager.edgeCreationMode().subscribe(() => this.toggleEdgeCreationMode());
      GraphSchematicsManager.onChangeVertex().subscribe((data:any) => {
        this.setState({
          vertices: this.state.vertices.map(vertice => {
            if (vertice.id === data.id) {
              return {
                ...vertice,
                label: data.label,
                isFinal:  data.isFinal
              }
            }
            return vertice
          })
        }, () => {
          GraphSchematicsManager.changeVerticeArray(this.state.vertices);
          GraphSchematicsManager.setGraphState(this.state);
        }
        );
        this.forceUpdate();
      });
      GraphSchematicsManager.onDeleteEdge().subscribe((edge:any) => {
        this.setState((prevState:any) => {
          if (prevState.edgeWeights[edge.source])
            delete prevState.edgeWeights[edge.source][edge.target];
          if (prevState.edgeWeights[edge.source] !== undefined 
            && Object.keys(prevState.edgeWeights[edge.source]).length === 0) 
            delete prevState.edgeWeights[edge.source];
          return{
            edges: this.state.edges.filter(e => e.source !== edge.source || e.target !== edge.target),
          }});
      });
      GraphSchematicsManager.isPlaying().subscribe(async (state:any) => {
        const { vertices, actualVertex } = this.state;
        if (vertices.length === 0) return;

        if (state) {
          const initialVertex = actualVertex ? actualVertex : vertices.reduce((minVertex: any, currentVertex: any) => {
            return currentVertex.label < minVertex.label ? currentVertex : minVertex;
          }, vertices[0]).id;
          this.setState({ 
            actualVertex: initialVertex,
            vertexHistory: [initialVertex]
          }, () => {
            const currentVertex = vertices[0];
            this.playVertexSound(currentVertex);
            this.startTuringMachine();
          });
        } else {
          this.stopMachine();
        }
      });
      GraphSchematicsManager.onChangeX().subscribe((mov:any) => {
        const { offsetX } = this.state;
        this.setState({offsetX: offsetX + mov});
      });
      GraphSchematicsManager.onChangeY().subscribe((mov:any) => {
        const { offsetY } = this.state;
        this.setState({offsetY: offsetY + mov});
      });
      GraphSchematicsManager.onOffsetCenter().subscribe(() => {
        this.setState({offsetY: 0, offsetX: 0});
      });

      GraphSchematicsManager.onResetAll().subscribe(() => {
        this.setState(initState);
        GraphSchematicsManager.setGraphState(this.state);
      });
      GraphSchematicsManager.onLoadGraphState().subscribe((state: any) => {
        this.setState({
          ...state,
          audioContext
        });
        GraphSchematicsManager.setGraphState(this.state);
      });
      GraphSchematicsManager.onExternalUpdateVerticesEdges().subscribe((verticesAndEdges: any) => {
        if (verticesAndEdges.edges) {
          this.setState({
            vertices: verticesAndEdges.vertices,
            edges: verticesAndEdges.edges,
            edgeWeights: verticesAndEdges.edgeWeights
          });
        } else {
          this.setState({vertices: verticesAndEdges.vertices});
        }
        this.forceUpdate();
      });
      GraphSchematicsManager.onChangeConfig().subscribe((config: any) => this.setState({config}));

      // Algoritmos de Manipulação de Layout.
      GraphSchematicsManager.onApplyFruchtermanReingold().subscribe(() => {
          let { vertices, edges } = this.state;
          let algFruchtermanReingold = new FruchtermanReingold({
              iterations: 10,
              coolingFactor: 0.99
          });
          algFruchtermanReingold.initializeLayout(vertices);
          let executionCount = 0;
          const maxExecutions = 20;
          const interval = 50;
      
          const intervalId = setInterval(() => {
              let verticesUpdated = algFruchtermanReingold.layout(vertices, edges)
              this.setState({ vertices: verticesUpdated });
              vertices = verticesUpdated;
              
              executionCount++;
              if (executionCount >= maxExecutions) {
                  clearInterval(intervalId);
              }
          }, interval);
      });

      GraphSchematicsManager.onApplyKamadaKawai().subscribe(() => {
        let { vertices, edges } = this.state;
        let algKamadaKawai = new KamadaKawai();
        this.setState({ vertices: algKamadaKawai.layout(vertices, edges) });
      });

      GraphSchematicsManager.onApplyCircularLayoutSubject().subscribe(() => {
        let { vertices } = this.state;
        const circularLayout = new CircularLayout();
        this.setState({ vertices: circularLayout.layout(vertices) });
      });

      GraphSchematicsManager.onApplyGridLayoutSubject().subscribe(() => {
        let { vertices, edges } = this.state;
        const gridLayout = new GridLayout();
        this.setState({ vertices: gridLayout.layout(vertices, edges) });
      });

      GraphSchematicsManager.onApplyTreeLayout().subscribe((config) => {
        let { vertices, edges } = this.state;
        const treeLayout = new TreeLayout();
        this.setState({ vertices: treeLayout.layout(vertices, edges, config.inverted) });
      });

      GraphSchematicsManager.onApplyRadialLayout().subscribe((config) => {
        let { vertices, edges } = this.state;
        const treeLayout = new RadialLayout();
        this.setState({ vertices: treeLayout.layout(vertices, edges, config.selectedVertice) });
      });

      GraphSchematicsManager.onApplySpectralLayout().subscribe(() => {
        let { vertices, edges } = this.state;
        const spectralLayout = new SpectralLayout();
        this.setState({ vertices: spectralLayout.layout(vertices, edges) });
      });

      GraphSchematicsManager.exitCreationMode().subscribe(() => {
        this.setState({ edgeCreationMode: false, edgeStartVertex: null });
      });

      GraphSchematicsManager.onAddAndApplyEdgeAndTransitions().subscribe((obj) => {
        const {sourceId, targetId, transitions} = obj;
        this.addEdge(sourceId, targetId);
        this.setState(prevState => {
          const newWeights = { ...prevState.edgeWeights };
          
          if (!newWeights[sourceId]) newWeights[sourceId] = {};
          if (!newWeights[sourceId][targetId]) newWeights[sourceId][targetId] = [];
          
          const newTransitions = transitions.map((transition: any) => ({
            read: transition.input,
            write: transition.output,
            move: transition.direction === 'left' ? 'L' : 'R'
          }));
          
          newWeights[sourceId][targetId].push(...newTransitions.filter(
            (t:any) => !newWeights[sourceId][targetId].find((e: any) => e.read == t.read && e.write == t.write))
          );
          
          return { edgeWeights: newWeights };
        });
      });

      TuringMachineTape.onTapeChange().subscribe((tape: any) => {
        if (this.state.isRunning) {
          this.setState({ tape });
          return;
        }
        this.setState({ tape, headPosition: tape.length / 2 - 2 });
      });

    }
    mounted = true;
  }

  startTuringMachine = () => {
    const { config, headPosition } = this.state;
    this.setState({
      currentState: 0,
      headPosition:  config.continueFromStoppedSimulation && headPosition ? headPosition : this.state.tape.length/2 - 2,
      isRunning: true,
    }, this.runMachine);
  };

  runMachine = async () => {
    while (this.state.isRunning) {
      GraphSchematicsManager.changeStatus("neutral");
      const { tape, headPosition } = this.state;
      GraphSchematicsManager.changeHeadPositionAndTape(headPosition, tape);
      await new Promise(resolve => setTimeout(resolve, 500 / this.state.config.speed));
      const hasNextStep = this.moveToNextVertex();
      if (!hasNextStep) {
        if (hasNextStep !== undefined) {
          if (this.state.vertices.find(v => v.id === this.state.actualVertex)?.isFinal) {
            GraphSchematicsManager.changeStatus("accepted");
          } else {
            GraphSchematicsManager.changeStatus("rejected");
          }
        }
        this.stopMachine();
        break;
      }
    }
  };

  stopMachine = () => {
    const { config } = this.state;
    if (config.continueFromStoppedSimulation) {
      this.setState( { isRunning: false });
      return;
    }
    const initialTapeSize = 1000;
    const initialTape = Array(initialTapeSize).fill(config.useEmptyTapeValue ? "" : "0");
    this.setState( { isRunning: false, actualVertex: null, tape: initialTape  });
  };

  private getTreatEmptyValue(e: any) {
    const r = String(e);
    if (r.trim() === "") return "B";
    return r;
  }

  moveToNextVertex = () => {
    const { actualVertex, edges, edgeWeights, tape, headPosition } = this.state;
    if (actualVertex === null) return;
  
    const currentSymbol = this.getTreatEmptyValue(tape[headPosition]);
    let transitionFound = false;
    let nextVertex = null;
    let selectedTransition = null;

    const possibleEdges = edges.filter(edge => edge.source === actualVertex);
    for (const edge of possibleEdges) {
      const transitions = edgeWeights[edge.source]?.[edge.target] || [];
      const validTransition = transitions.find(transition => this.getTreatEmptyValue(transition.read) === currentSymbol);
      if (validTransition) {
        nextVertex = edge.target;
        selectedTransition = validTransition;
        transitionFound = true;
        break;
      }
    }
  
    if (transitionFound && nextVertex !== null && selectedTransition) {
      const newTape = [...tape];
      newTape[headPosition] = selectedTransition.write;

      let newHeadPosition = headPosition;
      if (selectedTransition.move === 'R') newHeadPosition++;
      else if (selectedTransition.move === 'L') newHeadPosition = Math.max(0, newHeadPosition - 1);
      
      if (newHeadPosition >= newTape.length) {
        newTape.push('0');
      }

      this.setState(prevState => {
        const updatedVertices = prevState.vertices.map(v => 
          v.id === nextVertex ? { ...v, visitCount: (v.visitCount || 0) + 1 } : v
        );
        GraphSchematicsManager.changeHeadPositionAndTape(newHeadPosition, newTape);
        GraphSchematicsManager.changeVerticeArray(updatedVertices);
        return {
          actualVertex: nextVertex,
          vertexHistory: [...prevState.vertexHistory, nextVertex],
          vertices: updatedVertices,
          tape: newTape,
          headPosition: newHeadPosition,
          currentState: nextVertex
        };
      }, async () => {
        const currentVertex = this.state.vertices.find(v => v.id === nextVertex);
        if (currentVertex) {
          await this.playVertexSound(currentVertex);
        }
      });
      return true;
    }
    GraphSchematicsManager.setGraphState(this.state);
    return false;
  };


  playVertexSound = async (vertex: Vertex) => {
    if (!vertex.sound) {
      this.audioManager.playNote(440);
      return;
    }

    try {
      if (vertex.sound.type === 'note') {
        const frequency = NOTE_FREQUENCIES[vertex.sound.value as NotaMusical];
        this.audioManager.playNote(frequency);
      } else {
        const url = vertex.sound.value as string;
        if (!url) return;

        const buffer = await this.audioManager.loadAudio(url);
        this.audioManager.playBuffer(buffer);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
      this.audioManager.playNote(440);
    }
  };

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
    if (this.centroidUpdateTimer) {
      clearTimeout(this.centroidUpdateTimer);
    }
  }

  debouncedUpdateCentroid = () => {
    if (this.centroidUpdateTimer) {
      clearTimeout(this.centroidUpdateTimer);
    }

    this.centroidUpdateTimer = setTimeout(() => {
      this.setState(prevState => ({
        centroidUpdateCounter: prevState.centroidUpdateCounter + 1
      }), this.updateCentroid);
    }, 200);
  }

  handleResize = () => {
    this.setState({
      width: window.innerWidth - offsetWidth,
      height: window.innerHeight
    });
  };

  private selectedVertex(vertexId:any) {
    GraphSchematicsManager.vertexSelected(vertexId ? {
      ...this.state.vertices.find((v) => v.id === vertexId),
      edges: this.state.edges.filter(e => e.source === vertexId)
    } : null);
  }

  updateStateCallback = () => GraphSchematicsManager.setGraphState(this.state);

  handleVertexMouseDown = (event: React.MouseEvent, id: number) => {
    if (this.state.edgeCreationMode) {
      if (this.state.edgeStartVertex === null) {
        this.setState({ edgeStartVertex: id }, this.updateStateCallback);
      } else {
        AddEdgeModal.openModal({sourceId: this.state.edgeStartVertex, targetId: id});
      }
    } else {
      this.setState({ draggingVertex: true, selectedVertex: id }, this.updateStateCallback);
      this.selectedVertex(id);
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  };

  handleMouseDown = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    const { selectedVertex } = this.state;
  
    if (selectedVertex !== null && target.tagName !== 'circle' && target.tagName !== 'rect' && target.tagName !== 'text') {
      this.setState({ selectedVertex: null }, this.updateStateCallback);
      this.selectedVertex(null);
    }
  
    if (!this.state.edgeCreationMode) {
      this.isDragging = true;
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  };

  handleMouseMove = (event: React.MouseEvent) => {
    if (!this.isDragging) return;
  
    const { draggingVertex, selectedVertex, vertices, scale } = this.state;
  
    if (draggingVertex && selectedVertex !== null) {
      const deltaX = (event.clientX - this.startX) / (scale**2);
      const deltaY = (event.clientY - this.startY) / (scale**2);

      const vertex = vertices.find(v => v.id === selectedVertex);
      if (!vertex) return;
  
      const newX = vertex.x + deltaX;
      const newY = vertex.y + deltaY;
  
      const isColliding = vertices.some((v) => {
        if (v.id === selectedVertex) return false;
        const dx = v.x - newX;
        const dy = v.y - newY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < minDistance / scale;
      });
  
      if (!isColliding) {
        const updatedVertices = vertices.map(v =>
          v.id === selectedVertex
            ? { ...v, x: newX, y: newY }
            : v
        );
  
        this.setState({ vertices: updatedVertices }, this.updateStateCallback);
        GraphSchematicsManager.changeVerticeArray(this.state.vertices);
  
        this.startX = event.clientX;
        this.startY = event.clientY;
      }
    } else {
      const deltaX = event.clientX - this.startX;
      const deltaY = event.clientY - this.startY;
  
      this.setState(prevState => ({
        offsetX: prevState.offsetX + deltaX,
        offsetY: prevState.offsetY + deltaY,
      }), this.updateStateCallback);
  
      this.startX = event.clientX;
      this.startY = event.clientY;
    }
  };

  handleMouseUp = () => {
    this.setState({ draggingVertex: false });
    this.isDragging = false;
  };

  handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const scaleAmount = -event.deltaY * 0.001;
    this.setState(prevState => {
      const newScale = Math.min(maxZoom, Math.max(minZoom, prevState.scale + scaleAmount));
      return { scale: newScale };
    });
  };

  addVertex = (x: number, y: number, label: string) => {
    const { offsetX, offsetY, scale, vertices } = this.state;
    const newX = (x - offsetX) / (scale ** 2);
    const newY = (y - offsetY) / (scale ** 2);
  
    const isOverlapping = vertices.some(vertex => {
      const dx = vertex.x - newX;
      const dy = vertex.y - newY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      return distance < minDistance / scale;
    });
  
    if (!isOverlapping) {
      nextVertexId +=1;
      this.setState((prevState: any) => {
        const newState = [...prevState.vertices, { id: nextVertexId, x: newX, y: newY, label, visitCount: 0, sound: {type: 'note', value: NotaMusical.LA}, isFinal: false }]
        GraphSchematicsManager.changeVerticeArray(newState);
        return {
        vertices: newState
      }}, this.updateStateCallback);
    } else {
      AlphabetIterator.subIndex();
      console.log("Cannot add vertex: Overlapping with an existing vertex");
    }
  };

  addEdge = (sourceId: number, targetId: number) => {
    this.setState(prevState => {
      const newEdge = { source: sourceId, target: targetId };
      const newEdges = [...prevState.edges, newEdge];
      return {
        edges: newEdges
      };
    }, this.updateStateCallback);
  };


  toggleEdgeCreationMode = () => {
    this.setState(prevState => ({
      edgeCreationMode: !prevState.edgeCreationMode,
      edgeStartVertex: null
    }), this.updateStateCallback);
  };

  deleteVertex = (id: number) => {
    this.setState(prevState => {
      const updatedVertices = prevState.vertices.filter(vertex => vertex.id !== id);
      const updatedEdges = prevState.edges.filter(edge => edge.source !== id && edge.target !== id);
  
      return {
        vertices: updatedVertices,
        edges: updatedEdges,
        selectedVertex: null
      };
    }, this.updateStateCallback);
  };

  renderGrid() {
    const { width, height, scale } = this.state;
    const gridSize = 50;
    const lines = [];
    const extraLines = 300;
    const scaledGridSize = gridSize * scale;

    for (let x = - scaledGridSize * extraLines; x < width + scaledGridSize * extraLines; x += scaledGridSize) {
      lines.push(
        <line key={`v-${x}`} x1={x} y1={-scaledGridSize * extraLines} x2={x} y2={height + scaledGridSize * extraLines} stroke="#1c1c27" strokeWidth="1" />
      );
    }
    for (let y = - scaledGridSize * extraLines; y < height + scaledGridSize * extraLines; y += scaledGridSize) {
      lines.push(
        <line key={`h-${y}`} x1={-scaledGridSize * extraLines} y1={y} x2={width + scaledGridSize * extraLines} y2={y} stroke="#1c1c27" strokeWidth="1" />
      );
    }

    return lines;
  }

  renderVertices() {
    const { vertices, scale, selectedVertex, actualVertex } = this.state;

    return vertices.map((vertex) => (
      <g 
        key={vertex.id} 
        transform={`translate(${vertex.x * scale},${vertex.y * scale})`} 
        onMouseDown={(event) => this.handleVertexMouseDown(event, vertex.id)}
      >
        {selectedVertex === vertex.id && (
          <>
            <rect transform={`scale(${1 / this.state.scale})`}
              x={(-vertexRadius - selectionBorderSize) * scale}
              y={(-vertexRadius - selectionBorderSize) * scale}
              width={(vertexRadius + selectionBorderSize) * 2 * scale}
              height={(vertexRadius + selectionBorderSize) * 2 * scale}
              fill="rgba(255, 255, 255, 0.3)"
              rx="15"
              ry="15"
            />
            
            <g
              onMouseDown={() => this.deleteVertex(vertex.id)}
              style={{ cursor: 'pointer' }}
              transform={`translate(${(vertexRadius + selectionBorderSize - 15)}, ${(-vertexRadius - selectionBorderSize - 15)})`}
            >
              <rect width="30" height="30" rx="5" ry="5" />
              <foreignObject x="0" y="0" width="30" height="30" className='graph-schematics--trash-icon-container'>
                <FontAwesomeIcon icon={faTrash} size="lg" className='graph-schematics--trash-icon'/>
              </foreignObject>
            </g>
          </>
        )}

        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feFlood floodColor="#ff6666" result="glowColor" />
            <feComposite in="glowColor" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Circle */}
        <circle 
          cx={0} 
          cy={0} 
          r={vertexRadius} 
          fill={actualVertex === vertex.id ? "#5b3146" : "rgb(75 52 63)"} 
          filter={actualVertex === vertex.id ? "url(#glow)" : ''}
        />

        {/* Inner Circle for Final Vertex */}
        {vertex.isFinal && (
          <circle 
            cx={0} 
            cy={0} 
            r={vertexRadius * 0.8}
            fill="none" 
            stroke="white" 
            strokeWidth="2"
          />
        )}

        {/* Vertex Label */}
        <text 
          x={0} 
          y={9} 
          textAnchor="middle" 
          fill="white" 
          fontSize={30}
        >
          {vertex.label}
        </text>
      </g>
    ));
}

  renderEdges() {
    const { vertices, edges, scale } = this.state;
    return edges.map((edge, index) => {
      const source = vertices.find(vertex => vertex.id === edge.source);
      const target = vertices.find(vertex => vertex.id === edge.target);
  
      if (!source || !target) return null;
  
      if (source.id === target.id) {
        return this.renderSelfLoop(source, index, scale);
      } else {
        const dual = edges.find(edge => target.id === edge.source && source.id === edge.target);
        if (!dual) {
          return this.renderNormalEdge(source, target, index, scale, 0.1, 0.04, false);
        } else {
          return this.renderNormalEdge(source, target, index, scale, 0.3, 0.08, true);
        }
      }
    });
  }

  private getTransitionText(source: Vertex, target: Vertex = source) {
    const transitions = this.state.edgeWeights[source.id]?.[target.id] || [];
    return transitions.map(t => `${t.read}→${t.write},${t.move}`).join('\n');
  }

  renderNormalEdge(source: Vertex, target: Vertex, index: number, scale: number, angleAdjustment:number, curvature:number, variableCurvature: boolean) {
    const dx = target.x - source.x;
    const dy = target.y - source.y;
    
    const startAngle = Math.atan2(dy, dx) + angleAdjustment;
    const endAngle = Math.atan2(dy, dx) - angleAdjustment;
    
    const sourceX = source.x + vertexRadius * Math.cos(startAngle);
    const sourceY = source.y + vertexRadius * Math.sin(startAngle);
    const targetX = target.x - vertexRadius*1.4 * Math.cos(endAngle);
    const targetY = target.y - vertexRadius*1.4 * Math.sin(endAngle);
    
    const midX = (sourceX + targetX) / 2;
    const midY = (sourceY + targetY) / 2;

    const { centroid } = this.state;

    const directionX = centroid ? midX - centroid.x  : 0;
    const directionY = centroid ? midY - centroid.y : 0;

    const curvatureSign = !variableCurvature && (directionX * dy - directionY * dx > 0) ? -1 : 1;

    const adjustedCurvature = curvature * curvatureSign;
    
    const controlX = midX - (targetY - sourceY) * adjustedCurvature;
    const controlY = midY + (targetX - sourceX) * adjustedCurvature;

    const path = `M ${sourceX * scale} ${sourceY * scale} Q ${controlX * scale} ${controlY * scale} ${targetX * scale} ${targetY * scale}`;

    const t = 0.5; 
    const inputX = (1-t)*(1-t)*sourceX + 2*(1-t)*t*controlX + t*t*targetX;
    const inputY = (1-t)*(1-t)*sourceY + 2*(1-t)*t*controlY + t*t*targetY;

    const tangentX = 2*(1-t)*(controlX-sourceX) + 2*t*(targetX-controlX);
    const tangentY = 2*(1-t)*(controlY-sourceY) + 2*t*(targetY-controlY);
    const tangentLength = Math.sqrt(tangentX*tangentX + tangentY*tangentY);
    const normalX = -tangentY / tangentLength;
    const normalY = tangentX / tangentLength;

    const offsetDistance = 20; 
    const inputPosX = (inputX + normalX * offsetDistance) * scale;
    const inputPosY = (inputY + normalY * offsetDistance) * scale;

    return (
      <g key={index}>
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="0"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
          </marker>
        </defs>
        <path
          d={path}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <foreignObject className='graph-schematics--input'
          x={inputPosX - 15 * scale}
          y={inputPosY - 15 * scale}
          width={'100%'}
          height={'100%'}
        >
          <div className='input-edge' style={{ whiteSpace: 'pre-line' , fontSize: '15px' }}>
            {this.getTransitionText(source, target)}
          </div>
        </foreignObject>
      </g>
    );
  }

  updateCentroid = () => {
    let centroidVertex = null;
    try {
      centroidVertex = SimulatorUtils.calculateCentroidVertex(this.state.vertices);
    } catch {}
    this.setState({ centroid: centroidVertex });
  }

  componentDidUpdate(prevProps: {}, prevState: any) {
    if (prevState.vertices !== this.state.vertices) {
      this.debouncedUpdateCentroid();
    }
  }
  

  renderSelfLoop(vertex: Vertex, index: number, scale: number) {
    const loopRadius = vertexRadius * 0.8;
    const startAngle = -Math.PI / 4;
    const endAngle = Math.PI + Math.PI / 4;

    const offsetEnd = 1;
    const offsetStart = 5;

    const startX = vertex.x + (vertexRadius + offsetStart) * Math.cos(startAngle);
    const startY = vertex.y + (vertexRadius + offsetStart) * Math.sin(startAngle);
    const endX = vertex.x + (vertexRadius + offsetEnd) * Math.cos(endAngle);
    const endY = vertex.y + (vertexRadius + offsetEnd) * Math.sin(endAngle);

    const path = `
      M ${endX * scale} ${endY * scale}
      A ${loopRadius * scale} ${loopRadius * scale} 0 1 1 ${startX * scale} ${startY * scale}
    `;

    const inputAngle = -Math.PI / 2;
    const inputRadius = loopRadius + vertexRadius + 15; 
    const inputX = vertex.x + inputRadius * Math.cos(inputAngle);
    const inputY = vertex.y + inputRadius * Math.sin(inputAngle);

    return (
      <g key={index}>
        <defs>
          <marker
            id="self-loop-arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="8"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#ffffff" />
          </marker>
        </defs>
        <path
          d={path}
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          markerEnd="url(#self-loop-arrowhead)"
        />
        <foreignObject
          x={(inputX - 20) * scale}
          y={(inputY - 10) * scale}
          width={60 * scale}
          height={'100%'}
        >
          <div className='input-edge' style={{ whiteSpace: 'pre-line' }}>
            {this.getTransitionText(vertex)}
          </div>
        </foreignObject>
      </g>
    );
  }

  renderCentroid() {
    const { centroid, scale } = this.state;
    if (!centroid) return null;

    return (
      <circle
        cx={centroid.x * scale}
        cy={centroid.y * scale}
        r={5}
        fill="red"
      />
    );
  }


  render() {
    const { width, height, edgeCreationMode } = this.state;

    return (
      <div id="GraphSchematics" className="graph-schematics"
        onMouseDown={this.handleMouseDown}
        onMouseMove={this.handleMouseMove}
        onMouseUp={this.handleMouseUp}
        onMouseLeave={this.handleMouseUp}
        onWheel={this.handleWheel}
        style={{ cursor: this.isDragging ? 'grabbing' : edgeCreationMode ? 'crosshair' : 'grab' }}
      >
        <AddEdgeModal></AddEdgeModal>
        <svg width={width} height={height}>
          <g transform={`translate(${this.state.offsetX},${this.state.offsetY}) scale(${this.state.scale})`}>
            {this.renderGrid()}
            {this.renderEdges()}
            {this.renderVertices()}
            {debugMode ? this.renderCentroid() : null}
          </g>
        </svg>
      </div>
    )
  }

  private isDragging: boolean;
  private startX: number;
  private startY: number;
}