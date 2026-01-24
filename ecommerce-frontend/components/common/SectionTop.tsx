import React from 'react'
import { FaArrowRight, FaArrowRightLong } from 'react-icons/fa6'

const SectionTop = () => {
  return (
    <div className="section-top">
            <h2 className="section-top-title">New Arrivals</h2>
            <button>View All <FaArrowRightLong />
</button>
    </div>
  )
}

export default SectionTop