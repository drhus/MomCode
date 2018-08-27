'use strict';



hexListTable.addEventListener('click', function({ target: cell }) {
  l('click');

  // first 2 columns not editable
  if (cell.cellIndex < 2) {
    return;
  }


  let newCellVal = prompt('New cell value:', cell.textContent.trim());
  if (newCellVal === null) {
    return;
  }

  const rowElem = cell.parentElement;
  const num = rowElem.dataset.num;
  newCellVal = newCellVal.trim();
  if (cell.cellIndex < 4) {
    if (newCellVal === '') {
      alert("Value can't be empty for char or color column.");
      return;
    }
  }
  else { // last cell
    if (newCellVal === '') {

      if (hexList[num] === undefined) {
        // create empty symbol
        hexList[num] = [...EMPTY_SYMBOL];
        // show it in row
//        rowElem.cells[2] = EMPTY_SYMBOL[0];
//        rowElem.cells[3] = EMPTY_SYMBOL[1];

        updateRow();//cell, '');
        processInputStringChange();
        return;
      }
      
      // delete third value in current symbol of current hexlist
      hexList[num].splice(-1);
      updateRow();//cell, newCellVal);
      processInputStringChange();
//      cell.textContent = newCellVal;
      return;
    }
  }

  // create empty symbol
  if (hexList[num] === undefined) {
    hexList[num] = [...EMPTY_SYMBOL];
    // show it in row
//    rowElem.cells[2] = EMPTY_SYMBOL[0];
//    rowElem.cells[3] = EMPTY_SYMBOL[1];
//    updateRowCells(cell, newCellVal);
//    return;
  }
  // store new value in current hexList
  hexList[num][cell.cellIndex - 2] = newCellVal;
  updateRow();//cell, newCellVal);
  processInputStringChange();
//  cell.textContent = newCellVal;
//  l(newVal)





  function updateRow() {
  //  const rowElem = cell.parentElement;
  //  const firstCell = rowElem.firstElementChild;
  //  const num = rowElem.dataset.num;

    if (rowElem.classList.contains('empty')) {
      rowElem.cells[2].textContent = EMPTY_SYMBOL[0];
      rowElem.cells[3].textContent = EMPTY_SYMBOL[1];
      rowElem.classList.remove('empty');
    }

    cell.textContent = newCellVal;
    rowElem.firstElementChild.innerHTML = getHtmlForSymbol(hexList[num]);
  }












  return;







  // already editing
  if (cell.tagName === 'INPUT') {
    return;
  }

  // first 2 columns
  if (cell.cellIndex < 2) {
    return;
  }

//  if (editingCell !== null) {
//    editingCell.textContent = editingCell.firstElementChild.value;
//  }
//  if (editingCell !== null) { //) && !isCellEdited) {
//    l('343434');
  //  editingCell.textContent = editingCell.firstElementChild.value;
//  }

  if (editingCell !== null && !isCellEdited) {
    l('343434');
    editingCell.textContent = editingCell.firstElementChild.value;
  }








  editingCell = cell;
//  isChangeEventFired = false;
  isCellEdited = false;

  const cellText = editingCell.textContent.trim();
  editingCell.innerHTML = `<input type="text" value ="${cellText}"/>`;
  editingCell.firstElementChild.focus();


  // todo !!!
    editingCell.addEventListener('blur', function() {
      l('blur1');
    });

    editingCell.firstElementChild.addEventListener('blur', function() {
      l('blur2');
    });




});

/*
hexListTable.addEventListener('input', function() {
  l('input', event)

  isCellEdited = true;

//  editingCell.textContent = editingCell.firstElementChild.value;

});
*/

/*
document.addEventListener('click', function() {
  l('click', event, event.target.closest('section'));
});
*/



hexListTable.addEventListener('change', function(event) {
  l('change', event)
  isCellEdited = true;



//  event.preventDefault();
//  return;

//  isChangeEventFired = true;

//return;
//  if (!isCellEdited) {
//  l('nothing');
//    return;
//  }

  editingCell.textContent = editingCell.firstElementChild.value;

  // store new value


});

