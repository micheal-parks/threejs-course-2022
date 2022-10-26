import * as THREE from 'three'

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

renderer.setSize(window.innerWidth, window.innerHeight)
camera.position.set(5, 4, 5)
camera.lookAt(0, 0, 0)



document.body.append(renderer.domElement)

let then = performance.now()

const frame = (dt: number) => {
  const now = performance.now()
  const delta = now - then

  mesh.rotation.x += 0.01

  mesh.material.opacity -= 0.01

  then = now

  requestAnimationFrame(frame)

  renderer.render(scene, camera)
}

requestAnimationFrame(frame)
