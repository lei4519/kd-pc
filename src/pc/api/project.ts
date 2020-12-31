// import axios from '@/kd/plugins/global-methods/axios'

export async function getProject() {
  return JSON.parse(localStorage.getItem('project') || '{}')
}

export async function saveProject(project: any) {
  return localStorage.setItem('project', project)
}
