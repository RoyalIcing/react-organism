#!/usr/bin/env node

const Path = require('path')
const FS = require('fs')
const Spawn = require('cross-spawn')
const { resolve, coroutine, runNode } = require('creed')
const _ = require('lodash')

const accessibleFile = (path) => runNode(FS.access, path).map(() => path).catch(() => null)

const ensureDir = (path) => runNode(FS.mkdir, path).catch(e => {
    if (e.code === 'EEXIST') {
        return
    }

    throw e
})

const installPackage = coroutine(function * installPackage(projectPath, packageName) {
    const appPackage = require(Path.join(projectPath, 'package.json'))
    const dependencies = appPackage.dependencies || {}
    const hasInstalled = !!dependencies[packageName]
    if (hasInstalled) {
        return
    }

    const useYarn = !!(yield accessibleFile(Path.join(projectPath, 'yarn.lock')))
    const command = useYarn ? 'yarnpkg' : 'npm'
    let args = useYarn ? ['add'] : ['install', '--save']
    args.push(packageName)
    const proc = Spawn.sync(command, args, { stdio: 'inherit' })
    if (proc.status !== 0) {
      throw new Error(`\`${command} ${args.join(' ')}\` failed with status ${proc.status}`)
    }
})

function * run([ inputName, ...args ]) {
    //const fileName = _.kebabCase(inputName)
    const componentName = _.upperFirst(_.camelCase(inputName))

    let projectPath = process.cwd()
    let srcPath = yield accessibleFile(Path.resolve(projectPath, 'src'))
    const codePath = srcPath || projectPath

    // Add react-organism dependency
    yield installPackage(projectPath, 'react-organism')

    // organisms/
    const organismsDirPath = Path.resolve(codePath, 'organisms')
    yield ensureDir(organismsDirPath)

    // organisms/:fileName
    const organismPath = Path.join(organismsDirPath, componentName)
    yield ensureDir(organismPath)

    // organisms/:fileName/component.js
    yield runNode(FS.writeFile, Path.join(organismPath, 'component.js'), makeComponentJS(componentName))
    // organisms/:fileName/state.js
    yield runNode(FS.writeFile, Path.join(organismPath, 'state.js'), makeStateJS(componentName))
    // organisms/:fileName/index.js
    yield runNode(FS.writeFile, Path.join(organismPath, 'index.js'), makeIndexJS(componentName))
}


function makeStateJS(componentName) {
    return `
export const initial = () => ({
  // TODO: initial state properties
})

export const example = (props, ...args) => (prevState) => {
    // TODO: return changed state
    return prevState
}
`.trim()
}


function makeComponentJS(componentName) {
    return `
import React from 'react'

export default function ${componentName}({
    // TODO: props
    handlers: {
        example
        // TODO: state handlers
    }
}) {
  return (
    <div>
    </div>
  )
}
`.trim()
}

function makeIndexJS(componentName) {
    return `
import makeOrganism from 'react-organism'
import ${componentName} from './component'
import * as state from './state'

export default makeOrganism(state, ${componentName})
`.trim()
}

coroutine(run)(process.argv.slice(2))
    .catch(error => {
        console.error(error.message)
    })