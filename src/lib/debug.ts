import * as THREE from 'three'
import { composer, renderer, scene, camera } from 'three-kit'
import Debug from 'three-debug'

new Debug(THREE, scene, camera, renderer, composer)
