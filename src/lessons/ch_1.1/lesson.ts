import Debug from 'three-debug'
import * as THREE from 'three'
import { resizeRendererToDisplaySize } from '../../lib/resize'

THREE.ColorManagement.legacyMode = false

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()

camera.near = 0.001
camera.far = 100
camera.position.set(0, 10, 20)
camera.lookAt(0, 0, 0)
scene.add(camera)

const sungeo = new THREE.SphereGeometry(3)
const sunmat = new THREE.MeshBasicMaterial({ color: 'gold' })
const sun = new THREE.Mesh(sungeo, sunmat)
sun.name = 'Sun'
scene.add(sun)

const earthgeo = new THREE.SphereGeometry(1)
const earthmat = new THREE.MeshBasicMaterial({ color: 'dodgerblue' })
const earth = new THREE.Mesh(earthgeo, earthmat)
earth.position.x = 7
earth.name = 'Earth'
sun.add(earth)

const moongeo = new THREE.SphereGeometry(0.1)
const moonmat = new THREE.MeshBasicMaterial({ color: 'gainsboro' })
const moon = new THREE.Mesh(moongeo, moonmat)
moon.position.x = 2
moon.name = 'Moon'
earth.add(moon)

const frame = () => {
  requestAnimationFrame(frame)

  sun.rotation.y += 0.01
  earth.rotation.y += 0.01

  resizeRendererToDisplaySize(renderer, camera)

  renderer.render(scene, camera)
}

document.body.append(renderer.domElement)

requestAnimationFrame(frame)

new Debug(THREE, scene, camera, renderer)