import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { CubeCamera, MixOperation } from 'three'

import { FlakesTexture } from 'three/examples/jsm/textures/FlakesTexture'

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
 
import { TextureLoader } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Models
 */
const gltfLoader = new GLTFLoader()
let mixer = null
let cameraGLTF = null
let controls = null

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

/**
 * Camera
 */
// Base camera
let camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
let childCamera = null


let adModel = null
let tildaModel = null
let floorModel = null

// GLTF loads the external models 
gltfLoader.load ('/models/AD/AD-logo.gltf', 
    (gltf) => 
    {   
        let texture = new THREE.CanvasTexture(new FlakesTexture())


        const ballMaterial = {
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            metalness: 0.2,
            roughness: 0.1,
            color: 0x8418ca,
            normalMap: texture,
            normalScale: new THREE.Vector2(0.5,1)
        }


        const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
        let ballMatt = new THREE.MeshPhysicalMaterial(ballMaterial)
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.repeat.x = 500  
        texture.repeat.y = 500
        

        adModel = gltf.scene.children[1]
        floorModel = gltf.scene.children[2]
        console.log ( gltf.scene )
        adModel.material = bakedMaterial
        // floorModel.material = bakedMaterial
        floorModel.material = ballMatt
        floorModel.receiveShadow = true
        adModel.castShadow = true

        // TRAVERSE combs through the elements of the imported model 
        // gltf.scene.traverse((child) =>
        //     {
        //         child.material = bakedMaterial
        //     })
        // animation of the elements in the scene

        // MIXER Adds animation to the imported models
        mixer = new THREE.AnimationMixer(gltf.scene)
        const actionCamera = mixer.clipAction(gltf.animations[2])
        const actionAD = mixer.clipAction(gltf.animations[0])
        
        actionCamera.play()
        actionAD.play()
        
        scene.add(gltf.scene)
        // cameraGLTF = gltf.cameras [ 0 ]
        // scene.add(cameraGLTF)
        // cameraGLTF.scale.set (1,1,1)

        scene.add(camera)
        
        const tick = () =>
        {
            const elapsedTime = clock.getElapsedTime()
            const deltaTime = elapsedTime - previousTime
            previousTime = elapsedTime
        
            // Mixer update animation for the AD logo
            if (mixer !== null){
                mixer.update(deltaTime)
            }

            // if (cameraGLTF !== null){
            //     // console.log (cameraGLTF)
            //     renderer.render(scene, cameraGLTF)
            // ORBIT CONTROL UPDATE SECTION --- Update controls  donm't forget to un comment this part too when turning orbit controls on
            // controls.update() 
            // }

            renderer.render(scene, camera)

            // Linking Blender's camera position to the Three.JS camera

            const blendrCamPos = {}
            blendrCamPos.x = gltf.scene.children[0].position.x
            blendrCamPos.y = gltf.scene.children[0].position.y
            blendrCamPos.z = gltf.scene.children[0].position.z

            const blendrCamRot = {}
            blendrCamRot.x = gltf.scene.children[0].rotation.x
            blendrCamRot.y = gltf.scene.children[0].rotation.y
            blendrCamRot.z = gltf.scene.children[0].rotation.z
        
            camera.position.set(blendrCamPos.x, blendrCamPos.y, blendrCamPos.z)
            camera.rotation.set (blendrCamRot.x, blendrCamRot.y, blendrCamRot.z)
  
            //

            // Update controls  donm't forget to un comment this part too when turning orbit controls on
            // controls.update() 


            window.requestAnimationFrame(tick)
        }
        tick()
    })

/**
 * Floor
 */
// const floor = new THREE.Mesh(
//     new THREE.PlaneGeometry(10, 10),
//     new THREE.MeshStandardMaterial({
//         color: '#444444',
//         metalness: 0,
//         roughness: 0.5
//     })
// )
// floor.receiveShadow = true
// floor.rotation.x = - Math.PI * 0.5
// scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff,8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

//


/**
 * Texture loader
 */
const textureLoader = new THREE.TextureLoader()



/**
 * Textures
 */
const bakedTexture = textureLoader.load('/models/AD/AD-Backed.jpg')
bakedTexture.flipY = false




/**
 * Materials
 */

// Baked material



 // Controls   When making orbit actrive make sure to take out the comment section in the Tic animation section
//  controls = new OrbitControls(camera, canvas)
//  controls.target.set(0, 0.75, 0)
//  controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0