import React from 'react';
import './Projects.css';

const projects = () => {
    return (
       <>
        <div className="project">
                <h3>Our projects</h3>
                <p className="project-title">We are well drilling and repair non-profit organization. 
                The following are the jobs we have done, we are doing and plan to do. We have drilled 
                wells for villages in need of clean water and have repaired wells that have fallen into 
                disrepair. We are also working on a project to provide clean water to schools in rural areas. 
                We are always looking for new projects to undertake and are always open to new ideas. If you 
                have any suggestions, please don't hesitate to contact us.</p>
        </div>
        <div className="projects mb-40">
                <div className="todo">
                    <h1>Todo</h1>
                <div className="drill">
                        <h2>Drilling</h2>
                        <ul>
                     <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                    </ul>        
                    </div>
                    <div className="repair pt-10">
                        <h2>Repairs</h2>
                        <ul>
                     <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                    </ul>        
                        </div>
                </div>

                <div className="progress">
                    <h1>Working on</h1>
                <div className="drill">
                        <h2>Drilling</h2>
                    <ul>
                     <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                    </ul>                    
                    </div>
                    <div className="repair pt-10">
                        <h2>Repairs</h2>
                        <ul>
                     <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                    </ul>        
                    </div>
                </div>

                <div className="done">
                    <h1>Done</h1>
                    <div className="drill">
                        <h2>Drilling</h2>
                        <ul>
                     <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                    </ul>        
                    </div>
                    <div className="repair pt-10">
                        <h2>Repairs</h2>
                        <ul>
                     <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                        <li>Drilling</li>
                    </ul>        
                    </div>
                </div>
        </div>

<div class=" youtube-video embed-responsive embed-responsive-21by9 relative w-full overflow-hidden pt-25">
    <h3>Below is our Video report</h3>
<iframe width="1080" height="500" src="https://www.youtube.com/embed/GQ5MIaiJf0A" title="YouTube video player" frameborder="yes" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

        
       </>
    );
}

export default projects;
