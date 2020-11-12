var fs = require('fs');

const COMPONENTS_DIR = './components/_mui/';

function _createFile(name, data, extension='.js'){
    dir =  COMPONENTS_DIR;
    const path = dir + _componentName(name) + '/' + _componentName(name) + extension
    fs.writeFile(path, data, { flag: 'wx' }, function (err) {
        if (err) throw err;
        console.log('✅ "' + path + '" is created');
    });    
}

function _componentName(name){
    return name.charAt(0).toUpperCase() + name.slice(1);
} 

function createModule(name){
    var dir = `${COMPONENTS_DIR}/${_componentName(name)}`;

    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    _createFile(name, reactBoilerPlate(name));
    _createFile(name, styleBoilerPlate(name), '.styles.js');
    _createFile(name, storyBoilerPlate(name), '.stories.js');
}

const reactBoilerPlate = name => `import PropTypes from 'prop-types'
import React from 'react'

import ${_componentName(name)}Styles from './${_componentName(name)}.styles'

export default function ${_componentName(name)}(props) {
  const {childrent} = props
  const classes = ${_componentName(name)}Styles()

  return (
    <${_componentName(name)}>
      
    </${_componentName(name)}>
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
  title: '',
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
if(!method){
    throw new Error('Method is required'); 
} 
if(method === 'create'){
    const [name] = process.argv.slice(3);
    if(!name) throw new Error('You must provide a name'); 
    createModule(name)  
}else{
    console.error(`"${method}" is not a method. Use "create"`); 
}

  