var fs = require('fs');

const COMPONENTS_DIR = './components/_mui/';
const MODULES_DIR = './modules/';

function _createFile(dir, name, data, extension='.js'){
    const path = dir + _componentName(name) + '/' + _componentName(name) + extension
    fs.writeFile(path, data, { flag: 'wx' }, function (err) {
        if (err) throw err;
        console.log('✅ "' + path + '" is created');
    });    
}
function _createExportFile(dir, componentName){
  const path = dir + _componentName(componentName) + '/index.js'
  const data = `export {default} from './${componentName}'`
  fs.writeFile(path, data, { flag: 'wx' }, function (err) {
    if (err) throw err;
    console.log('✅ "' + path + '" is created');
  });    
}

function _componentName(name){
    return name.charAt(0).toUpperCase() + name.slice(1);
} 

function abstractFactory(directory, name){
    var dir = `${directory}/${_componentName(name)}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    _createFile(directory, name, reactBoilerPlate(name));
    _createFile(directory, name, styleBoilerPlate(name), '.styles.js');
    _createFile(directory, name, storyBoilerPlate(name), '.stories.js');
    _createExportFile(directory, name);
}

const createComponent = abstractFactory.bind(null, COMPONENTS_DIR);
const createModule = abstractFactory.bind(null, MODULES_DIR);

const reactBoilerPlate = name => `import PropTypes from 'prop-types'
import React from 'react'

import ${_componentName(name)}Styles from './${_componentName(name)}.styles'

export default function ${_componentName(name)}(props) {
  const {childrent} = props
  const classes = ${_componentName(name)}Styles()

  return (
    <div>
        ${_componentName(name)}
    </div>
  )
}

${_componentName(name)}.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}`;

const styleBoilerPlate = name => `import { makeStyles } from '@material-ui/core/styles'

const ${_componentName(name)}Styles = () => {
  return makeStyles(theme => {
    const mq = theme.breakpoints.up
    const space = theme.spacing
    return {
      root: {
          [mq('lg')]: {
            
          },
          [mq('xl')]: {
            
          },
        },
      }
  })();
}
export default ${_componentName(name)}Styles`;

const storyBoilerPlate = name =>`import React from 'react'

import ${_componentName(name)} from './${_componentName(name)}'

export default {
  title: 'Component/${_componentName(name)}',
  component: ${_componentName(name)},
  argTypes: {
    title: { control: 'text' },
  },
}

const Template = args => <${_componentName(name)} {...args} />

export const WithContent = Template.bind({})
WithContent.args = {
  title: 'My title for ${_componentName(name)}.',
}
WithContent.storyName = '${_componentName(name)}'`;


const [method] = process.argv.slice(2);
const [type] = process.argv.slice(3);
if(!method){
    throw new Error(`Method is required. 'create' is available. Use is like yt-cli {method} {type} {name}`); 
} 
if(!type){
  throw new Error(`Type is required. Use 'component' or 'module'`); 
} 
if(method === 'create'){
    const [name] = process.argv.slice(4);
    if(!name) throw new Error('You must provide a name'); 
    switch(type){
      case 'module': 
        createModule(name)  
      break;
      case 'component': 
        createComponent(name)  
        break;
      default:
        throw new Error(`The method ${method} with type ${type} is invalid`)
    }
    
}else{
    console.error(`"${method}" is not a method. Use "create"`); 
}

  