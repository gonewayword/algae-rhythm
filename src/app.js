$(document).ready(() => {
    
    // TODO: move to own class file
    class App {
        logger = new Logger();
        timeline = new Timeline();
        constructor(){}

        initialize() {
            this.logger.debug('hi debuggo');
            this.timeline.attach('#main-timeline');
            const cachedMasterListSerialized = localStorage.getItem('master-list');
            const cachedLifeListSerialized = localStorage.getItem('life-list');
            console.log('cached master? ', cachedMasterListSerialized);
            console.log('cached life? ', cachedLifeListSerialized);
            const cleanedMaster = !!cachedMasterListSerialized ? 
                this.deserializeList(cachedMasterListSerialized) :
                [];
            const cleanedLife = !!cachedLifeListSerialized ?
                this.deserializeList(cachedLifeListSerialized) :
                [];
            console.log('cleaned master? ', cleanedMaster);
            console.log('cleaned life? ', cleanedLife);
            if (!!cleanedMaster.length) {
                this.populateList('master-list', cleanedMaster);
            }
            if (!!cleanedLife.length) {
                this.populateList('life-list', cleanedLife);
            }
        }

        initializeMainTimeline() {
            const thisApp = this;
            // this.timeline.attach('#progenitor');
            const prototype = $('#progenitor').outerHTML;
            const curWidth = screen.width;
            $('#main-timeline').append(prototype);

            /* List-related events */
            $('button.list-adder').click((e) => {
                const listId = $(e.target).data('listname');
                this.addItemToList(listId);
                thisApp.initializeDynamicallyAffectedEvents();
            });

            $('.task').hover(function() {
                $('.task').find('.deleter').removeClass('reveal');
                $(this).find('.deleter').addClass('reveal');
            });
            $('.deleter').click(function() {
                const confirmed = confirm('Are you sure you want to delete this list item?');
                if (!confirmed) return;
                $(this).parent().remove();
                thisApp.saveAllLists();
            });

            this.initializeDynamicallyAffectedEvents();
        }

        deserializeList(list) {
            return list.split('$sep$');
        }

        addItemToList(listId, value) {
            if (!listId) return;
            $('#' + listId).find('.tasklist').append('<span draggable="true" class="task">' +
                '<input type="checkbox"/>' +
                (!!value ? '<input type="text" value="'+ value +'" />' : '<input type="text" placeholder="new item" />') +
                '<span class="deleter">X</span>' +
            '</span>');
        }

        populateList(listId, vals) {
            $('#' + listId + ' .tasklist').empty();
            let i = 0;
            while (i < vals.length) {
                this.addItemToList(listId, vals[i]);
                i++;
            }
        }

        initializeDynamicallyAffectedEvents() {
            console.log('initializeDynamicallyAffectedEvents()');
            const thisApp = this;
            $('.tasklist').each(function() {
                const listId = $(this).data('listid');
                $(this)
                    .find('.task')
                    .each(function() {
                        $(this)
                            .find('input[type="text"]')
                            .first()
                            .focusout(function() {
                                thisApp.saveList(listId);
                            })
                    });
            });
        }

        saveAllLists() {
            // TODO: should loop through all main lists and eventually all custom lists grabbed from user
            this.saveList('master-list');
            this.saveList('life-list');
        }

        saveList(listId) {
            const resArray = [];
            const tasks = $('#' + listId).find('.task').map(function() {
                return $(this).find('input[type="text"]');
            });
            console.log('tasks = ', tasks);
            tasks.each(function() {
                resArray.push($(this).val());
            });
            console.log('res array = ', resArray);
            localStorage.setItem(listId, resArray.join('$sep$'));
            const testRes = localStorage.getItem(listId);
            console.log('test res = ', testRes);
        }

        activateSortableList(sortableList) {

            const items = sortableList.querySelectorAll(".task");
    
            items.forEach(item => {
                item.addEventListener("dragstart", () => {
                    console.log('dragstart')
                    // Adding dragging class to item after a delay
                    setTimeout(() => item.classList.add("dragging"), 0);
                });

                // Removing dragging class from item on dragend event
                item.addEventListener("dragend", e => {
                    console.log('event? ', e);
                    console.log('task', item);
                    console.log('list', sortableList);
                    item.classList.remove('dragging');
                });
            });
            
            const initSortableList = (e) => {
                e.preventDefault();
                const draggingItem = document.querySelector(".dragging");
                // Getting all items except currently dragging and making array of them
                let siblings = [...sortableList.querySelectorAll(".item:not(.dragging)")];
            
                // Finding the sibling after which the dragging item should be placed
                let nextSibling = siblings.find(sibling => {
                    return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
                });
            
                // Inserting the dragging item before the found sibling
                sortableList.insertBefore(draggingItem, nextSibling);
            }
            
            sortableList.addEventListener("dragover", initSortableList);
            sortableList.addEventListener("dragenter", e => e.preventDefault());

        }

    }

    const app = new App();
    app.initialize();

    app.initializeMainTimeline();

    const sortableList = $(".tasklist");
    console.log(sortableList);
    // NOTE: of course, this callback must not be an arrow function or 'this' becomes the window.
    sortableList.each(function(i) {
        console.log('list:', this);
        app.activateSortableList(this);
    });

    


});