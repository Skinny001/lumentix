#![no_std]

mod contract;
mod events;
mod models;

#[cfg(test)]
mod tests;

pub use contract::TicketContract;
pub use events::{CheckInEvent, TransferEvent};
pub use models::{EventAuth, Ticket, ValidatorKey};
