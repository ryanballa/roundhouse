import React, { FunctionComponent, ReactNode } from 'react';
import { styledComponent } from '../../utils/styledComponent';
import shortid from 'shortid';

const StyledDiv = styledComponent('div', {
  '& input': {
    marginRight: '10px',
  },
  '& li': {
    listStyle: 'none',
  },
  '& ul': {
    margin: '0 15px 0 0',
    padding: 0,
  },
});

type DataType = {
  roads: [];
};

type RoadFilterProps = {
  data: DataType;
  filters: [number | string];
  onFilter: ([]) => {};
  setFilters: ([]) => {};
};

const RoadFilter: FunctionComponent<RoadFilterProps> = ({
  data,
  filters,
  onFilter,
  setFilters,
}) => (
  <StyledDiv>
    <h2>Filter</h2>
    <ul>
      {data.roads.map((road, i) => (
        <li key={shortid.generate()}>
          <input
            data-testid={road}
            checked={filters.indexOf(i) > -1}
            onChange={e => {
              const options = filters;
              let index;
              if (e.target.checked) {
                if (options.indexOf(e.target.value) === -1) {
                  options.push(+e.target.value);
                }
              } else {
                index = options.indexOf(+e.target.value);
                options.splice(index, 1);
              }
              setFilters(options);
              onFilter(options);
            }}
            type="checkbox"
            value={i}
          />
          {road}
        </li>
      ))}
    </ul>
  </StyledDiv>
);

export default RoadFilter;
