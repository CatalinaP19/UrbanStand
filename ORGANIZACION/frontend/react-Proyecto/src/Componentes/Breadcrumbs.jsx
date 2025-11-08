import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const BreadcrumbContainer = styled.div`
  padding: 10px 20px;
  border-radius: 4px;
  margin: 10px 0;
`;

const BreadcrumbItem = styled.span`
  color: ${props => props.isLast ? '#097950ff' : '#666'};
    font-weight: bold;
  &:not(:last-child):after {
    content: '>';
    margin: 0 8px;
    color: #666;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  font-size: 16px;
  color: #680d0dff;
  &:hover {
    color: #ff7300ff;
    text-decoration: underline;
  }
`;

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <BreadcrumbContainer>
      <BreadcrumbItem>
        <StyledLink to="/">Inicio</StyledLink>
      </BreadcrumbItem>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        return (
          <BreadcrumbItem key={name} isLast={isLast}>
            {isLast ? (
              name.charAt(0).toUpperCase() + name.slice(1)
            ) : (
              <StyledLink to={routeTo}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </StyledLink>
            )}
          </BreadcrumbItem>
        );
      })}
    </BreadcrumbContainer>
  );
};

export default Breadcrumbs;
