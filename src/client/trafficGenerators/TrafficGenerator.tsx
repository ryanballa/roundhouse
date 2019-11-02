/* eslint-disable react/no-multi-comp */
import React, { useState } from 'react';
import Breadcrumb from '../components/atoms/Breadcrumb';
import EditTrafficGenerator from './components/EditTrafficGenerator';
import { Link } from 'react-router-dom';
import { HeaderToolbar } from '../components/organisms/HeaderToolbar';
import SingleColumn from '../components/layout/SingleColumn';
import { styledComponent } from '../utils/styledComponent';
import { usePromise } from '../utils/promise.hook';
import trafficGeneratorsService from '../services/trafficGenerators.service';

const StyledDiv = styledComponent('div', {});

type TrafficGeneratorProps = {
  history: {
    push: () => void;
  };
};

const TrafficGenerator: React.FC<TrafficGeneratorProps> = ({ history }) => {
    const [isEditTrafficGeneratorOpen, setIsEditTrafficGeneratorOpen] = useState(false);
    const [data, error, isLoading, setData] = usePromise(
        trafficGeneratorsService.view(1),
        [],
        [],
    );

  return (
    <SingleColumn history={history}>
      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <StyledDiv>
            <Breadcrumb
                items={[
                    { link: '/traffic-generators', text: 'Traffic Generators' },
                    { text: data[0].destination_id },
                ]}
            />
            <HeaderToolbar description="" title={data[0].name}>
                <Link
                    onClick={() => { setIsEditTrafficGeneratorOpen(true); }}
                    to={`/traffic-generators/${data[0].id}`}
                >
                Edit
                </Link>
                <EditTrafficGenerator
                    handleModalClose={() => {
                        setIsEditTrafficGeneratorOpen(false);
                    }}
                    trafficGenerator={data[0]}
                    isOpen={isEditTrafficGeneratorOpen}
                />
            </HeaderToolbar>
            <ul>
              <li>Destination: {data[0].destination_id}</li>
              <li>Type: {data[0].type}</li>
            </ul>
        </StyledDiv>
      )}
    </SingleColumn>
  );
};

export default TrafficGenerator;
