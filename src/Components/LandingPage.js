import React from 'react';
import { TypeAnimation } from 'react-type-animation';
import '../Style/LandingPage.css'; // Import the CSS for styling
import Navbar from './NavBar';
import { Card, CardContent, Typography, IconButton, Grid } from '@mui/material'; // Import necessary components
import LinkedInIcon from '@mui/icons-material/LinkedIn'; // LinkedIn icon
import GitHubIcon from '@mui/icons-material/GitHub'; // GitHub icon
import team from '../Assets/team.jpg'; // Replace with the actual image path
import UploadFileIcon from '@mui/icons-material/UploadFile'; // or AttachFile
import BoltIcon from '@mui/icons-material/Bolt'; // For the Instant Insights feature
import VisibilityIcon from '@mui/icons-material/Visibility'; // or Search
import HeadsetIcon from '@mui/icons-material/Headset'; // or Audiotrack
import RoundedButton from './RoundedButton'; // Import your RoundedButton component
import Gaurav from '../Assets/Gaurav.jpeg';
import Abhinav from '../Assets/Abhinav.jpeg';
import Pushkar from '../Assets/Pushkar.jpeg';
import Chirag from '../Assets/Chirag.png';
import Nandini from '../Assets/Nandini.jpeg';

const LandingPage = () => {
  const teamMembers = [
    {
      name: 'Chirag Garg',
      role: 'Backend Developer',
      linkedIn: '#',
      github: '#',
      image: Chirag,
      description: 'Passionate about building innovative web applications, continuously learning new technologies, and striving to improve user experiences through creative solutions'
    },
    {
      name: 'Gaurav Goyal',
      role: 'Dev-Ops Engineer',
      linkedIn: '#',
      github: '#',
      image: Gaurav,
      description: 'A specialist in automating, managing, and optimizing software development and deployment processes to ensure seamless integration and delivery'
    },
    {
      name: 'Abhinav Aggarwal',
      role: 'Frontend Engineer',
      linkedIn: '#',
      github: '#',
      image: Abhinav,
      description: 'Dedicated to creating responsive user interfaces, optimizing performance, and enhancing user experiences with modern web technologies'
    },
    {
      name: 'Nandini Gera',
      role: 'Backend Engineer',
      linkedIn: '#',
      github: '#',
      image: Nandini,
      description: 'Backend engineer focused on developing robust server-side applications, managing databases, and ensuring seamless integration with frontend technologies'
    },
    {
      name: 'Pushkar Garg',
      role: 'AI engineer',
      linkedIn: '#',
      github: '#',
      image: Pushkar,
      description: 'AI engineer dedicated to designing and implementing intelligent systems using machine learning, deep learning, and natural language processing techniques'
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="landing-container" id="home">
        <h1 className="gradient-heading">Welcome to PDF Genie</h1>
        <h1 className="typing-effect">
          <TypeAnimation
            sequence={[
              'Innovative.', 1000,
              'Creative.', 1000,
              'Reliable.', 1000,
              'Efficient.', 1000,
              'Future-ready.', 1000,
            ]}
            wrapper="span"
            cursor={true}
            repeat={0}
            style={{ fontSize: '100px' }}
          />
        </h1>

        {/* Add the personalized text here */}
        <h6 className="sub-heading" style={{ fontSize: '2.5rem', marginTop: '60px', color: '#e6f4e4' }}>
          Your Personalized Intelligent PDF System
        </h6>
      </div>

      {/* New Section with Four Parts in a Grid */}
      <div className="features-container">
        <Grid container spacing={4} justifyContent="center" id="about">
          {[
            {
              title: 'Upload your sources',
              description:
                'Upload PDFs, websites, YouTube videos, audio files, Google Docs, or Google Slides, and NotebookLM will summarize them and make interesting connections between topics, all powered by Gemini 1.5’s multimodal understanding capabilities.',
              icon: <UploadFileIcon style={{ fontSize: '2.5rem', color: 'inherit' }} />,
            },
            {
              title: 'Instant insights',
              description:
                'With all of your sources in place, NotebookLM gets to work and becomes a personalized AI expert in the information that matters most to you.',
              icon: <BoltIcon style={{ fontSize: '2.5rem', color: 'inherit' }} />,
            },
            {
              title: 'See the source, not just the answer',
              description:
                'Gain confidence in every response because NotebookLM provides clear citations for its work, showing you the exact quotes from your sources.',
              icon: <VisibilityIcon style={{ fontSize: '2.5rem', color: 'inherit' }} />,
            },
            {
              title: 'Listen and learn on the go',
              description:
                'Our new Audio Overview feature can turn your sources into engaging “Deep Dive” discussions with one click.',
              icon: <HeadsetIcon style={{ fontSize: '2.5rem', color: 'inherit' }} />,
            },
          ].map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <div className="feature">
                {feature.icon}
                <Typography variant="h5" className="feature-title">
                  {feature.title}
                </Typography>
                <Typography variant="body2" className="feature-description">
                  {feature.description}
                </Typography>
              </div>
            </Grid>
          ))}
        </Grid>
      </div>

      {/* Add the RoundedButton below the feature box */}
      <div style={{ marginBottom: '50px', textAlign: 'center' }}>
        <RoundedButton routeLink="/upload" label="Try PDF Genie" />
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#e6f4e4' }}>
          The People Behind the Magic
        </h2>
      </div>
      {/* Grid for team member cards */}
      <div className="team-container">
        <Grid container spacing={3} justifyContent="center" id="team">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  {/* Member Image */}
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                  <Typography
                    variant="h5"
                    component="div"
                    style={{ marginTop: '10px', textAlign: 'center' }}
                  >
                    {member.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    style={{ textAlign: 'center' }}
                  >
                    {member.role}
                  </Typography>
                  <Typography
                    variant="body2"
                    style={{ marginTop: '5px', textAlign: 'center' }}
                  >
                    {member.description}
                  </Typography>
                  {/* Links for LinkedIn and GitHub */}
                  <div
                    style={{
                      marginTop: '10px',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => window.open(member.linkedIn, '_blank')}
                      aria-label="LinkedIn"
                    >
                      <LinkedInIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => window.open(member.github, '_blank')}
                      aria-label="GitHub"
                    >
                      <GitHubIcon />
                    </IconButton>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );

};

export default LandingPage;