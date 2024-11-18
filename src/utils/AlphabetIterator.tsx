import GraphSchematicsManager from "../components/GraphSchematics/GraphSchematicsManager";
import { Vertex } from "../interfaces/Vertex";

export default class AlphabetIterator {
    private static currentIndex: number = 0;

    static reload() {
        this.currentIndex = 0;
    }
  
    static getNextLetter(): string {
        const getLabel = () => {
            const letterIndex = this.currentIndex % 26;
            const numberPart = Math.floor(this.currentIndex / 26);
            return numberPart === 0 
                ? String.fromCharCode(65 + letterIndex) 
                : `${String.fromCharCode(65 + letterIndex)}${numberPart}`;
        };
    
        const isLabelUsed = (label: string) => 
            GraphSchematicsManager.getGraphState()?.vertices?.some((v: Vertex) => v.label === label);
    
        let label;
        do {
            label = getLabel();
            this.currentIndex++;
        } while (isLabelUsed(label));
    
        return label;
    }

    static subIndex() {
        this.currentIndex--;
    }
}