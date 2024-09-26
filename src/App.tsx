import React from 'react';
import './App.css';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, EventSettingsModel } from '@syncfusion/ej2-react-schedule';
import axios from 'axios';

class App extends React.Component {
  public eventSettings: EventSettingsModel = { dataSource: [] };

  componentDidMount() {
    // Charger les événements depuis le backend
    axios.get('http://localhost:5000/events')
      .then((response) => {
        this.eventSettings = { dataSource: response.data };
        this.forceUpdate(); // Met à jour le composant avec les données chargées
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des événements :", error);
      });
  }

  handleActionComplete = (args: any) => {
    if (args.requestType === 'eventCreated') {
      const newEvent = args.data[0]; // Le nouvel événement créé
      axios.post('http://localhost:5000/events', newEvent)
        .then(() => {
          console.log('Nouvel événement ajouté avec succès');
        })
        .catch((error) => {
          console.error('Erreur lors de l\'ajout de l\'événement :', error);
        });
    }

    if (args.requestType === 'eventRemoved') {
      const removedEvent = args.data[0];
      axios.delete(`http://localhost:5000/events/${removedEvent.Id}`)
        .then(() => {
          console.log('Événement supprimé avec succès');
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression de l\'événement :', error);
        });
    }

    if (args.requestType === 'eventChanged') {
      const changedEvent = args.data;
      axios.put(`http://localhost:5000/events/${changedEvent.Id}`, changedEvent)
        .then(() => {
          console.log('Événement modifié avec succès');
        })
        .catch((error) => {
          console.error('Erreur lors de la modification de l\'événement :', error);
        });
    }
  }

  public render() {
    return (
      <ScheduleComponent
        eventSettings={this.eventSettings}
        actionComplete={this.handleActionComplete}
      >
        <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
      </ScheduleComponent>
    );
  }
}

export default App;
