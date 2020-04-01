export const UPDATE_FILES = data => update('UPDATE_FILES', data)
export const UPDATE_SELECTED_DIR = data => update('UPDATE_SELECTED_DIR', data)
export const UPDATE_CURRENT_EDIT_FILE = data => update('UPDATE_CURRENT_EDIT_FILE', data)
export const UPDATE_STATUS = data => update('UPDATE_STATUS', data)


const update = (type, data) => {
  return {type, data}
}