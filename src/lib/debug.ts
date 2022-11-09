import * as THREE from 'three'
import { composer, renderer, scene, camera } from 'three-kit'
import Inspector from 'three-inspect'

new Inspector(THREE, scene, camera, renderer, composer)
