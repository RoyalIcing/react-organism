import React, { Component } from 'react'

export default function FriendsList({
  friendsList,
  handlers: {
    addFriend
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
        <button onClick={ () => addFriend({ name: 'Jane Doe' }) } children='Add friend' />
      </div>
    </div>
  )
}