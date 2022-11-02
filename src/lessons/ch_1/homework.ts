import * as THREE from 'three'
import Debug from 'three-debug'

const renderer = new THREE.WebGLRenderer()
renderer.physicallyCorrectLights = true
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const camera = new THREE.PerspectiveCamera()
camera.position.set(0, 5, 0)
camera.lookAt(0, 0, 0)

const scene = new THREE.Scene()
scene.add(camera)

{
  const light = new THREE.AmbientLight('#a95959')
  light.intensity = 2
  scene.add(light)
}

{
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshStandardMaterial({ wireframe: true })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.castShadow = mesh.receiveShadow = true
  mesh.position.set(0, 0.5, 0)
  mesh.name = 'Box'
  scene.add(mesh) 
}

const debug = new Debug(THREE, scene, camera, renderer)

export const resizeRendererToDisplaySize = () => {
  const canvas = renderer.domElement
  const width = (canvas.clientWidth * window.devicePixelRatio) | 0
  const height = (canvas.clientHeight * window.devicePixelRatio) | 0
  const needResize = canvas.width !== width || canvas.height !== height

  if (needResize) {
    const aspect = canvas.clientWidth / canvas.clientHeight
    camera.aspect = aspect
    camera.updateProjectionMatrix()
    renderer.setSize(width, height, false)
  }
}

const frame = () => {
  requestAnimationFrame(frame)
  resizeRendererToDisplaySize()
  renderer.render(scene, camera)
}

requestAnimationFrame(frame)
