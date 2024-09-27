import React from 'react';
import { useRef } from 'react';
import './App.css';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, EventSettingsModel, ViewsDirective, ViewDirective } from '@syncfusion/ej2-react-schedule';
import axios from 'axios';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

class App extends React.Component {
  public scheduleObj = React.createRef<ScheduleComponent>();
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
  eventEditorButton = () => {
    let eventData: Object = {
      Id: 4,
      Subject: 'Meteor Showers in 2024',
      StartTime: new Date(2024, 8, 27, 13, 0),
      EndTime: new Date(2024, 8, 27, 14, 30)
    };
    this.scheduleObj.current?.openEditor(eventData, 'Save');
  };

  public render() {
    return (
      <div>
        <ButtonComponent onClick={this.eventEditorButton}>Add Event</ButtonComponent>
        <ScheduleComponent
          eventSettings={this.eventSettings}
          actionComplete={this.handleActionComplete}
        >
          <Inject services={[Day, Week, WorkWeek, Month, Agenda]} />
        </ScheduleComponent>
      </div>
    );
  }
}

export default App;
