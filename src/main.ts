import "./style.css";
import typescriptLogo from "./typescript.svg";
import viteLogo from "/vite.svg";
import { setupCounter } from "./counter.ts";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div id="container">
    
  </div>
`;

window.onload = () => {
  // 设置场景
  const scene = new THREE.Scene();

  // 设置相机
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(0, 0, 30);

  // 设置渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // 添加光源
  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  // 创建GLTF加载器
  const loader = new GLTFLoader();

  // 加载.glb文件
  loader.load('/Moon_1_3474.glb', function (gltf) {
    const moon = gltf.scene;
    scene.add(moon);
  
    // 计算模型的边界盒
    const box = new THREE.Box3().setFromObject(moon);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
  
    // 输出边界盒的信息
    console.log(`模型中心: ${center.x}, ${center.y}, ${center.z}`);
    console.log(`模型尺寸: ${size.x}, ${size.y}, ${size.z}`);
    
  
    // 将摄像机对准模型的中心
    camera.lookAt(center);
  
    // 调整摄像机的位置以确保模型在视野内（如果模型很大或很小）
    // camera.position.set(center.x, center.y, size.length() * 1.5); // 这里的1.5是一个假设的倍数，可能需要调整
    camera.position.set(0, 0, size.length())
    // 更新控制器的目标
    controls.target.copy(center);
    controls.update();
  }, undefined, function (error: any) {
    console.error(error);
  });

  // 控制器使能够旋转场景
  const controls = new OrbitControls(camera, renderer.domElement);

  // 动画循环渲染场景
  function animate() {
      requestAnimationFrame(animate);
      controls.update(); // 只有在使用控制器时才需要
      renderer.render(scene, camera);
  }

  animate();

  // 确保浏览器缩放时渲染器大小更新
  window.addEventListener('resize', onWindowResize, false);

  function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
  }
};
