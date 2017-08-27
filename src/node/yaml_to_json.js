import ExpIdSeq from '../js/exp/ExpIdSeq'
import fs       from 'fs'
import NPCloud  from '../js/exp/nouns/NPCloud'
import path     from 'path'
import yaml     from 'js-yaml'

const sentencesPath = path.resolve(__dirname, 'pimsleur.yaml')
const sentencesYaml = fs.readFileSync(sentencesPath, 'UTF-8')
const category_to_definitions = yaml.safeLoad(sentencesYaml)
console.log(category_to_definitions)

const expIdSeq = new ExpIdSeq()
const npCloud = new NPCloud(expIdSeq) // eslint-disable-line no-unused-vars
const hombre = npCloud.findByEs('hombre')
console.log(hombre)
