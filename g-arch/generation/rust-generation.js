const headers = `
#![allow(non_snake_case)]
use std::thread::{Builder, JoinHandle};
use std::error::Error;
use std::sync::{Arc, Mutex, Condvar};
use std::sync::mpsc::{Sender, channel, Receiver};
use std::iter::{FromIterator, Empty};
use std::sync::atomic::{AtomicUsize, Ordering};
use std::time::{Duration, Instant};
`;