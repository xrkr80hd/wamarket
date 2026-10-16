import{startPlannerSync}from './lib/planner-sync';
import{refreshLocalSession}from './lib/local-session';
import React from 'react';import{createRoot}from'react-dom/client';import Workspace from './app/workspace';import './app/globals.css';import './preview.css';import './day-planner.css';import './workspace.css';import './quick-ideas.css';import './studio.css';
startPlannerSync();refreshLocalSession().catch(()=>{});
if('serviceWorker' in navigator)navigator.serviceWorker.register('/local-files-worker.js').catch(()=>{});
class PreviewBoundary extends React.Component<{children:React.ReactNode},{error:string}>{state={error:''};static getDerivedStateFromError(error:Error){return{error:error.message}}render(){if(this.state.error)return <section style={{padding:35,maxWidth:650,margin:'40px auto'}}><h1>The preview needs attention</h1><p role="alert">{this.state.error}</p><p>Your local data has not been reset. Reload the preview to try again.</p><button onClick={()=>window.location.reload()}>Reload preview</button></section>;return this.props.children}}
createRoot(document.getElementById('root')!).render(<PreviewBoundary><div className="preview-banner">LOCAL PREVIEW · Demo workspace</div><Workspace/></PreviewBoundary>);
