import * as THREE from 'three'
import { run, scene, camera, renderer, update } from 'three-kit'
import Inspector from 'three-inspect'

THREE.ColorManagement.legacyMode = false

camera.position.set(0, 2, 10)
camera.far = 5000

let materials: THREE.Material[] = []

// Add an ambient light
{
  const ambient = new THREE.AmbientLight()
  ambient.intensity = 0.8
  scene.add(ambient)
}

// Add a directional light
{
  const directional = new THREE.DirectionalLight()
  directional.castShadow = true
  directional.shadow.mapSize.height = 1024
  directional.shadow.mapSize.width = 1024
  directional.intensity = 1.5
  scene.add(directional)
  directional.position.set(3, 5, 3)
}

{
  const geometry = new THREE.BufferGeometry();
  const vec3 = new THREE.Vector3();

  const count = 10_000
  const radius = 200

  const vertices = new Float32Array(count * 3);

  for (let i = 0; i < count * 3; i += 3) {
    vec3.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize().multiplyScalar(radius)
    vertices[i + 0] = vec3.x
    vertices[i + 1] = vec3.y
    vertices[i + 2] = vec3.z
  }
  
  // itemSize = 3 because there are 3 values (components) per vertex
  geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
  geometry.translate(0, 0.5, 0)

  const material = new THREE.PointsMaterial()
  material.size = 0.5
  material.sizeAttenuation = true
  const points = new THREE.Points(geometry, material)
  scene.add(points)
}

// Add the floor
{
  const geometry = new THREE.BoxGeometry(20, 5, 0.1).rotateX(Math.PI / 2).translate(0, -1, 0)
  const material = new THREE.MeshPhysicalMaterial({ color: 'lightslategrey' })
  material.envMapIntensity = 1
  material.reflectivity = 1
  material.clearcoat = 1
  material.clearcoatRoughness = 0.08
  materials.push(material)

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'Floor'
  mesh.castShadow = mesh.receiveShadow = true
  scene.add(mesh)
}

update(() => {

})

new Inspector(THREE, scene, camera, renderer)

run()
