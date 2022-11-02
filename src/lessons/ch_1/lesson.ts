import * as THREE from 'three'
import { resizeRendererToDisplaySize } from '../../lib/resize'

const renderer = new THREE.WebGLRenderer({
  antialias: true
})

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera()
camera.near = 0.001
camera.far = 1000

const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial()
material.wireframe = true
material.transparent = true

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

camera.position.set(5, 4, 5)
camera.lookAt(0, 0, 0)

let then = performance.now()
let opacityDelta = -0.01

const frame = () => {
  requestAnimationFrame(frame)

  const now = performance.now()
  const delta = now - then
  then = now

  mesh.rotation.x += 0.01

  mesh.material.opacity += opacityDelta

  if (mesh.material.opacity < 0 || mesh.material.opacity > 1) {
    opacityDelta = -opacityDelta
  }

  resizeRendererToDisplaySize(renderer, camera)

  renderer.render(scene, camera)
}

document.body.append(renderer.domElement)

requestAnimationFrame(frame)
