import React, { useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom';
import { apiCall } from '../helpers/apicalls';
import { EditListing } from './edit-listing';
import { Loading } from '../helpers/generics'
import { ListingDataContext } from '../listingDataContext';

export const EditListingFetch = () => {
  const params = useParams();
  const listingId = parseInt(params.id);
  const { listingData, setListingData } = useContext(ListingDataContext);
  console.log('fetch1', listingData);
  const savedDataExists = listingData.filter(x => x.id === listingId).length;

  if (!savedDataExists) {
    console.log('fetch2');
    useEffect(() => {
      apiCall('GET', '/listings/' + listingId, {}, true)
        .then((data) => {
          setListingData(old => [...old, {
            id: listingId,
            data: data.listing
          }]);
        })
    }, [])
  }

  return savedDataExists ? <EditListing listingId={listingId}/> : <Loading />
}
