import React, { Component } from 'react'

export default function FriendsList({
  friendsList,
  handlers: {
    addRandomFriend
  }
}) {
  return (
    <div>
      {
        !!friendsList ? (
          friendsList.map((friend, index) => (
            <div key={ index }>
              Name: { friend.name }
            </div>
          ))
        ) : (
          'Loading…'
        )
      }
      <div>
        <button onClick={ addRandomFriend } children='Add friend' />
      </div>
    </div>
  )
}