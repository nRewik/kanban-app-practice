import alt from '../libs/alt'
import NoteActions from '../actions/NoteActions'
import findIndex from '../libs/find_index'

class NoteStore{
	constructor(){
		this.bindActions(NoteActions)
		this.notes = this.notes || []
	}

	onCreate(note){
		const notes = this.notes
		this.setState({
			notes: notes.concat(note)
		})
	}

	onUpdate(note){
		const notes = this.notes;
		const targetId = findIndex(notes, 'id', note.id)
		notes[targetId].task = note.task
		this.setState({notes})
	}

	onDelete(id){
		const notes = this.notes
		const targetId = findIndex(notes, 'id', id)
		this.setState({
			notes: notes.slice(0, targetId).concat(notes.slice(targetId + 1))
		})
	}
}

export default alt.createStore(NoteStore, 'NoteStore')