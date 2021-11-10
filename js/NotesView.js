export default class NotesView {
    constructor(root,{ onNoteSelect , onNoteAdd , onNoteEdit , onNoteDelete }={} ){
        this.root = root;
        this.onNoteSelect = onNoteSelect;
        this.onNoteAdd = onNoteAdd;
        this.onNoteEdit = onNoteEdit;
        this.onNoteDelete = onNoteDelete;
        this.root.innerHTML  = `
        <div class="notes__sidebar">
        <button class="notes__add" type="button" >Add Note</button>
            <div class="notes__list">  
            </div>
            </div>
            <div class="notes__preview" >
                <input type="text" class="notes__title" placeholder="New Notes..." >
                <textarea name="notes"  cols="30" rows="10" class="notes__body">Take Notes....</textarea>
            </div>
        `;

        const btnAddNote = this.root.querySelector(".notes__add");
        const inpTitle = this.root.querySelector('.notes__title');
        const inpBody = this.root.querySelector('.notes__body');

        btnAddNote.addEventListener("click", ()=>{
            this.onNoteAdd();
        })
        console.log('this is title and body ', inpTitle, inpBody);
        setTimeout(() => {
            [inpTitle, inpBody].forEach(inputField => {
                inputField.addEventListener("blur", (e)=>{
                    const updatedTitle = inpTitle.value.trim();
                    const updateBody = inpBody.value.trim();
                    this.onNoteEdit(updatedTitle, updateBody);
                    
                })
            });
        }, 10);
      this.updateNotePreviewVisibility(false);
    }

    _createListItemHTML(id, title, body,updated){
        const MAX_BODY_LENGTH = 60;
        return `
        <div class="notes__list-item" data-note-id="${id}"  >
            <div class="notes__small-title">${title}</div>
            <div class="notes__small-body">
                ${body.substring(0, MAX_BODY_LENGTH)}
                ${body.length > MAX_BODY_LENGTH ? "..." : ""}

            </div>
            <div class="notes__small-updated">
             ${updated.toLocalString(undefined , {dateStyle :"full", timeStyle : "short"})}
            </div>
         </div>
        `
    }

    updateNoteList(notes){
        const noteListContainer = this.root.querySelector(".notes__list");

        //Empty list
        noteListContainer.innerHTML = "";      
        for (const note of notes) {
            const html = this._createListItemHTML(note.id,note.title, note.body, new Date(note.updated));
            noteListContainer.insertAdjacentHTML("beforeend", html);
        }

        noteListContainer.querySelectorAll('notes__list-item').forEach(noteListItem=>{
            noteListItem.addEventListener('click', ()=>{
                this.onNoteSelect(noteListItem.dataset.noteId);
            })

            noteListItem.addEventListener('dblclick', ()=>{
                const doDelete = confirm('Are you really want to delete this note');
                if(doDelete){
                    this.onNoteDelete(noteListItem.dataset.noteId);
                }
            })
        })
    }

    updateActiveNote(note){
        this.root.querySelector(".note__title").value = note.title;
        this.root.querySelector(".notes__body").value = note.body;

        this.root.querySelectorAll(".notes__list-item").forEach(noteListItem =>{
            noteListItem.classList.remove("notes__list-item-selected");
        })

        this.root.querySelector(`.notes__list-item[data-note-id="${note.id}"]`).classList.add("notes__list-item-selected");
    }

    updateNotePreviewVisibility(visible){
        this.root.querySelector('.notes__preview').style.visibility = visible ? 'visible' : 'hidden';
    }
}