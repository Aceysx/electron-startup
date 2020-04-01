import path from 'path'

const File = {
  name: _path => path.basename(_path),
  dir: _path => path.dirname(_path),
  join: _paths => path.join(..._paths),
}

export default File