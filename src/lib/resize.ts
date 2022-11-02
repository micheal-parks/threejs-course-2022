import * as THREE from 'three'

export const resizeRendererToDisplaySize = (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera | THREE.OrthographicCamera) => {
  const canvas = renderer.domElement
  const width = (canvas.clientWidth * window.devicePixelRatio) | 0
  const height = (canvas.clientHeight * window.devicePixelRatio) | 0
  const needResize = canvas.width !== width || canvas.height !== height

  if (needResize) {
    if (camera instanceof THREE.PerspectiveCamera) {
      const aspect = canvas.clientWidth / canvas.clientHeight
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }
  }
}
