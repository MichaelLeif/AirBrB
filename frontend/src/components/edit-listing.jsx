import React from 'react';
import { useParams } from 'react-router-dom';

export const EditListing = () => {
  const params = useParams();
  return (
    <div>
    Profile {params.name}
    </div>
  );
}
