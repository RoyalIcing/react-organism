import React, { Component } from 'react'

export default function FriendsList({
  friendsList,
  selectedIndex,
  onSelectAtIndex,
  handlers: {
    addRandomFriend
  }
}) {
  return (
    <div>
      {
        !!friendsList ? (
          friendsList.map((friend, index) => (
            <div key={ index }
              style={{
                backgroundColor: selectedIndex === index ? '#00b4ff' : undefined
              }}
              data-index_number={ index }
              onClick={ onSelectAtIndex }
            >
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